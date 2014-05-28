//DESCRIPTION: Create topics and page references from text tags
/*
	Two types of separator:
	1. Subtopics: \index{mammal@dog@retriever} is added to the index under mammal, 
	with subtopics dog and retriever.
	2. Names: \index{M. Carlsen%Carlsen, M.}: the topic appears as M. Carlsen but is sorted as Carlsen, M.
	The characters for the separators (here, @ and %) can be set in the script's interface.
	
	Cross-references
	> see
	>> see also
	>>> see [also]
	e.g. EU>European Union

	If the index tags are not deleted, they're placed in a hiding character style or in conditions.
*/

#target indesign;

if (app.documents.length > 0) {index_from_tags ();}

function index_from_tags()
{
	var tags = get_tags();
	var doc = app.documents[0];
	if (tags.replace_index == true && doc.indexes.length > 0)
		doc.indexes[0].topics.everyItem().remove();
	
	if (doc.indexes.length == 0)
		doc.indexes.add();
		
	tagsToCharacterStyles (doc, tags);
	
	var found = doc.findGrep();
	var Le = found.length;
	
	var w = new Window ('palette', 'Creating topics');
	w.pbar = w.add ('progressbar', [0,0,300,20], 0, Le);
	w.show();
	
	for (var i = Le-1; i > -1; i--)
	{
		w.pbar.value = Le-i;
		addPageRef (doc, found[i], tags);
	}

	if (tags.keep_tags == false)
		delete_tags (doc);
	
	w.close();
} // index_from_tags



function addPageRef (doc, found_item, tags) {
	var ip = found_item.insertionPoints[0].index;
	var topic_text = strip (found_item.contents, tags);
	var topic = create_topic (doc.indexes[0], topic_text, tags);
	if (topic == "") return; // If the topic is a cross-reference, an empty string is returned
	var p_ref = topic.pageReferences.add (found_item.insertionPoints[0], PageReferenceType.CURRENT_PAGE);
	if (Math.abs(p_ref.sourceText.index - ip) > 0){
		try {
			found_item.parentStory.characters[p_ref.sourceText.index].move (LocationOptions.after, found_item.insertionPoints[0]);
		} catch (_) {
		// . . .
		}
	}
	// return p_ref;
}


function delete_tags (doc)
{
	// Apply the [None] character style to all page references
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "~I";
	app.changeGrepPreferences.appliedCharacterStyle = doc.characterStyles[0];
	doc.changeGrep();
	
	// Remove anything in the temp style
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.appliedCharacterStyle = doc.characterStyles.item("index_from_tags");
	doc.changeGrep();
	
	try{doc.characterStyles.item("index_from_tags").remove()} catch(_){};
} // delete_tags



function tagsToCharacterStyles (doc, tags)
{
	if (!doc.characterStyles.item("index_from_tags").isValid)
	{
		doc.characterStyles.add ({name: "index_from_tags", pointSize: "0.1 pt", horizontalScale: 1});
		// doc.characterStyles.add ({name: "index_from_tags", fillColor: "C=0 M=100 Y=0 K=0"});
	}
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.changeGrepPreferences.appliedCharacterStyle = doc.characterStyles.item("index_from_tags");
	app.findChangeGrepOptions.includeFootnotes = true;
	app.findGrepPreferences.findWhat = tags.start + ".+?" + tags.stop;
	doc.changeGrep();
}



// remove start and end tags
function strip (s, tags)
{
	s = s.replace (RegExp ("^"+tags.start), "");
	return s.replace (RegExp (tags.stop+"$"), "");
}


function create_topic (index, s, tags)
{
//~ 		function FindTopic (index, n)
//~ 			{
//~ 			if (!index.topics.item(n).isValid)
//~ 				index.topics.add(n);
//~ 			return index.topics.item(n);
//~ 			} // FindTopic
		
		
	var new_top, ref_topic, parts;
	
	if (s.indexOf (">") > -1)   // see, see also, see [also]
		{
		var seealso = s.match (/>+/)[0];
		parts = s.split (/>+/);
		new_top = index.topics.add (parts[0]);
		switch (seealso)
			{
			case ">" : try {new_top.crossReferences.add (FindTopic (index, parts[1]), CrossReferenceType.see)}catch(_){}; break;
			case ">>" : try {new_top.crossReferences.add (FindTopic (index, parts[1]), CrossReferenceType.seeAlso)}catch(_){}; break;
			case ">>>" : try {new_top.crossReferences.add (FindTopic (index, parts[1]), CrossReferenceType.seeOrAlsoBracket)}catch(_){};
			}
		return "";
		}
	if (tags.name_sep != "" && s.indexOf(tags.name_sep) > -1)
		{
		parts = s.split (RegExp (tags.name_sep));
		new_top = index.topics.add (parts[0]);
		new_top.sortOrder = parts[1];
		return new_top;
		}

	if (tags.separator != "" && s.indexOf(tags.separator) > -1)
		{
		// remove any white space before or after the separator
		parts = s.split (RegExp (tags.separator));
		new_top = index.topics.add (parts[0]);
		for (var k = 1; k < parts.length; k++)
			new_top = new_top.topics.add (parts[k]);
		return new_top;
		}
	new_top = index.topics.add (s);
	return new_top;
	}

// Interface ==================================================================

function get_tags ()
	{
	var history = File(scriptdir()+"/index_from_tags.txt");
	var previous = read_history (history);
	var w = new Window ('dialog', 'Index from text tags', undefined, {closeButton: false});
	w.alignChildren = ['right', 'top'];
		var main = w.add ('panel');
		main.alignChildren = ['right', 'top'];
		main.orientation = 'column';
			g1 = main.add ('group');
				g1.add ('statictext', undefined, 'Start tag: ');
				var start_tag = g1.add ('edittext', undefined, previous.start);
				start_tag.active = true;
				start_tag.characters = 10;
			g2 = main.add ('group');
				g2.add ('statictext', undefined, 'Subtopic separator: ');
				var sep_tag = g2.add ('edittext', undefined, previous.separator);
				sep_tag.characters = 10;
			g3 = main.add ('group');
				g3.add ('statictext', undefined, 'Sort-order separator: ');
				var name_sep = g3.add ('edittext', undefined, previous.name_sep);
				name_sep.characters = 10;
			g4 = main.add ('group');
				g4.add ('statictext', undefined, 'End tag: ');
				var stop_tag = g4.add ('edittext', undefined, previous.stop);
				stop_tag.characters = 10;
				
		var replace_index = w.add ('checkbox', undefined, 'Replace existing index');
			replace_index.value = previous.replace;
			replace_index.alignment = 'left';
			
		var keep_tags = w.add ('checkbox {text: "Keep (and hide) tags"}');
			keep_tags.value = previous.keep_tags;
			keep_tags.alignment = 'left';
			
		var buttons = w.add ('group');
			buttons.orientation = 'row';
			buttons.alignChildren = ['right', 'bottom'];
			buttons.add ('button', undefined, 'OK');
			buttons.add ('button', undefined, 'Cancel', {name: 'cancel'});
			
	if (w.show () == 2)
		exit ();
	if (start_tag.text == "" || stop_tag.text == "")
		errorM ('Start tag and End tag must not be empty.');
	write_history (history, {start: start_tag.text, 
										separator: sep_tag.text, 
										name_sep: name_sep.text, 
										stop: stop_tag.text, 
										replace: replace_index.value,
										keep_tags: keep_tags.value
										});

	return {start: esc (start_tag.text), 
				separator: esc (sep_tag.text), 
				name_sep: esc (name_sep.text), 
				stop: esc (stop_tag.text), 
				replace_index: replace_index.value,
				keep_tags: keep_tags.value}
	}

function write_history (f, obj)
	{
	f.open ('w'); f.encoding = "utf-8";
	f.write (obj.toSource());
	f.close ();
	}


function read_history (f)
	{
	if (f.exists)
		{
		f.open ('r'); f.encoding = "utf-8";
		var obj = f.read ();
		f.close ();
		return eval (obj);
		}
	else
		return {start: "\\index{", separator: "", name_tag: "", stop: "}", replace: true};
	}

function disallowed (ch)
	{
//~ 	return "\\{}\"$%^&*()+=\[\]:;@~#?/<>".indexOf(ch) > -1;
	return "\\{}\"$^&*()+=\[\]:;?/~<>".indexOf(ch) > -1;
	}

function esc (s)
	{
	s = s.replace (/\\/g, "\\\\");
	s = s.replace (/([~.{}()\[\]])/g, "\\$1");
	return s.replace (/\$/g, "[$]");
	}


function errorM (m)
	{
	alert (m, "Error", true);
	exit ();
	}


function progress_bar (stop, title)
	{
	w = new Window ('palette', title);
	pb = w.add ('progressbar', undefined, 0, stop);
	pb.preferredSize = [300,20];
	w.show();
	return pb;
	}


function scriptdir()
	{
	try {return File (app.activeScript).path}
	catch (e) {return File (e.fileName).path}
	}