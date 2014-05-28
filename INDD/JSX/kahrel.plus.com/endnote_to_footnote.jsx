//DESCRIPTION: convert endnotes to footnotes
// Peter Kahrel -- www.kahrel.plus.com

#target indesign
#targetengine endnote_to_footnote;

main ();

function main ()
	{
	app.scriptPreferences.enableRedraw = false;
	var data = get_styles (app.activeDocument);
	end_to_foot (data);
	}


function end_to_foot (data)
	{
		
	// First some document-wide things
	
	var doc = app.activeDocument;
	// Some texts have footnotes and endnotes. Can't deal with them
	if (doc.stories.everyItem().footnotes.length > 0)
		{
		alert ('This document already contains footnotes.\rPlease remove them.');
		exit ();
		}

	// A display window showing progress
	var showmessage = create_message_window (30);
	showmessage.show();
	showmessage.txt.text = 'Checking styles...';

	//cstyle.properties = app.documents[0].characterStyles[0].properties;
	
	// Convert automatic paragraph numbers to text
	convert_numbering (data.pstyle)
	
	doc.footnoteOptions.footnoteTextStyle = data.pstyle;
	doc.footnoteOptions.footnoteTextStyle.bulletsAndNumberingListType = ListType.NO_LIST;
	doc.footnoteOptions.footnoteMarkerStyle = data.cstyle;
	doc.footnoteOptions.markerPositioning = FootnoteMarkerPositioning.NORMAL_MARKER;
	
	// We set the separator to "" because that makes it easier to remove the original not numbers
	// Later on (in "note_numbers()") we set the separator properly
	
	doc.footnoteOptions.separatorText = "";
	
	showmessage.txt.text = 'Collecting notes and references...'
	
	// Find notes and references and compare length
	var notes = fetch_notes (doc, data.pstyle);
	var refs = fetch_refs (doc, data.cstyle);
	if (notes.length != refs.length)
		{
		alert ("Notes and references do not match:\r(" + notes.length + " notes, " + refs.length + " references.)");
		exit ();
		}
	
	// Now process each story separately

	var stories = app.activeDocument.stories.everyItem().getElements();
	for (var i = 0; i < stories.length; i++)
		process_story (stories[i], data, showmessage);
		
	// Finish off at document level

	// Restore paragraph breaks
	setGrep ("%£%", "\\r", {FN: true});
	app.activeDocument.changeGrep();
	
	// Delete the old static references
	refs = fetch_refs (doc, data.cstyle);
	for (i = refs.length-1; i > -1; i--)
		{
		showmessage.txt.text = 'Removing static references... ' + i;
		refs[i].remove();
		}

	// Tart up the footnotes: fix the note numbers and remove trailing returns
	showmessage.txt.text = 'Cleaning up... ';
	note_numbers (doc, data.pstyle);
	try {showmessage.close()} catch(_){}
	}



function process_story (story, data, showmessage)
	{
	var notes = fetch_notes (story, data.pstyle);
	var refs = fetch_refs (story, data.cstyle);
	// Insert footnotes at the references
	for (var i = refs.length-1; i > -1; i--)
		{
		showmessage.txt.text = 'Inserting notes... ' + i;
		refs[i].insertionPoints[0].footnotes.add();
		}

	// Get notes again -- object references messed up after adding the footnotes
	var notes = fetch_notes (story, data.pstyle);
	
	// Get reference to footnotes
//~ 	var fn = refs[0].parentStory.footnotes;
	var fn = story.footnotes;
	
	// Move notes to the footnotes
	for (i = fn.length-1; i > -1; i--)
		{
		showmessage.txt.text = 'Copying notes... ' + i;
		notes[i].paragraphs[0].move (LocationOptions.after, fn[i].insertionPoints[-1]);
		}
	} // process_story
	


function convert_numbering (pstyle)
	{
	app.findGrepPreferences = null;
	app.findGrepPreferences.appliedParagraphStyle = pstyle;
	app.findGrepPreferences.findWhat = '^.'
	var p = app.activeDocument.findGrep();
	for (var i = 0; i < p.length; i++)
		p[i].convertBulletsAndNumberingToText();
	}



function note_numbers (doc, pstyle)
	{
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.appliedParagraphStyle = pstyle;
	app.findGrepPreferences.findWhat = /(?<=~F).+?\s/.source;
	doc.changeGrep ();
	// Remove trailing returns, stioll targeting the footnotes
	app.findGrepPreferences.findWhat = "\\r+$";
	doc.changeGrep ();
	doc.footnoteOptions.separatorText = ".^>";
	}


function fetch_notes (doc, pstyle)
	{
	// Make sure that each note is a single paragraph by replacing hard returns
	// which aren't followed by a digit with a code, here %£%
	setGrep (/\r(?!\d)/.source, "%£%", {PS: pstyle});
	doc.changeGrep ();
	app.findGrepPreferences.findWhat = "^\\d";
	return doc.findGrep();
	}


function fetch_refs (doc, cstyle)
	{
	app.findGrepPreferences = null;
	app.findGrepPreferences.findWhat = "\\d+";
	app.findGrepPreferences.appliedCharacterStyle = cstyle;
	return doc.findGrep ();
	}


function get_styles (doc)
	{
	var hfile = File (script_dir()+'/end_to_foot_styles.txt');
	var styles = read_history (hfile);
	var w = new Window ('dialog {text: "Endnotes to footnotes", properties: {closeButton: false}}');
		var c_styles = doc.characterStyles.everyItem().name;
		c_styles.shift();
		var p_styles = doc.paragraphStyles. everyItem().name;
		var panel = w.add ('panel {alignChildren: "right"}');
			var gr1 = panel.add ('group {_ : StaticText {text: "Character style:"}}');
			   var c_list = gr1.add ('dropdownlist', undefined, c_styles);
			var gr2 = panel.add ('group {_ : StaticText {text: "Paragraph style:"}}');
			   var p_list = gr2.add ('dropdownlist', undefined, p_styles);
			
		var buttons = w.add ('group {alignment: "right"}');
			buttons.add ('button', undefined, 'Cancel', {name: 'cancel'});
			buttons.add ('button', undefined, 'OK', {name: 'ok'});

		c_list.preferredSize.width = p_list.preferredSize.width = 200;

		var temp = c_list.find (styles.cstyle);
		if (styles.cstyle == undefined || temp ==  null)
			c_list.selection = 0;
		else
			c_list.selection = temp;

		temp = p_list.find (styles.pstyle);
		if (styles.pstyle == undefined || temp ==  null)
			p_list.selection = 0;
		else
			p_list.selection = temp;

	if (w.show () == 2)
	    exit ();
	else
		{
		write_history (hfile, {cstyle: c_list.selection.text, 
										pstyle: p_list.selection.text});

	    return {cstyle: doc.characterStyles.item (c_list.selection.text), 
	 	 	 	 pstyle: doc.paragraphStyles.item (p_list.selection.text)}
		 }
	}


function read_history (f)
	{
	if (!f.exists) return {}
	f.open ('r');
	var obj = f.read ();
    f.close ();
	return eval (obj);
	}


function write_history (f, obj)
	{
	f.open ('w');
	f.write (obj.toSource());
	f.close ();
	}


function script_dir()
	{
	try {return File (app.activeScript).path}
		catch (e) {return File (e.fileName).path}
	}


function errorM (m)
	{
	alert (m, 'Error', true);
	exit ();
	}


function setGrep (find, replace, options)
    {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findGrepPreferences.findWhat = find;
    app.changeGrepPreferences.changeTo = replace;
    if (options == undefined) options = {};
    if (options.PS !== undefined) app.findGrepPreferences.appliedParagraphStyle = options.PS;
    if (options.CS !== undefined) app.findGrepPreferences.appliedCharacterStyle = options.CS;
    app.findChangeGrepOptions.properties =
        {
        includeFootnotes: options.FN !== undefined,
        includeMasterPages: options.M !== undefined,
        includeHiddenLayers: options.HL !== undefined,
        includeLockedLayersForFind: options.LL !== undefined,
        includeLockedStoriesForFind: options.LS !== undefined
        }
    }



function create_message_window (le)
    {
	var dlg = Window.find ("palette", "Endnote to footnote");
	if (dlg == null)
		{
		dlg = new Window ("palette","Endnote to footnote", undefined,{closeButton: false});
		dlg.txt = dlg.add ('statictext', undefined, " ");
		dlg.txt.characters = le;
	}
	return dlg
	}

