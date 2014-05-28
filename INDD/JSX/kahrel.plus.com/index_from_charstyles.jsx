//DESCRIPTION: Add index markers to text formatted with selected character styles
// Peter Kahrel -- www.kahrel.plus.com

//#target indesign;

if (app.documents.length > 0 && parseInt (app.version) > 4) {
	mark_character_styles ();
}


function mark_character_styles ()
	{
	var data = select_character_styles (File (script_dir() + "/index_from_charstyle.txt"));
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findChangeGrepOptions.includeFootnotes = true;
	index_documents (data);
	}


function index_documents (data)
	{
	var displ = init_progress ();
	displ.show();
	for (var i = 0; i < app.documents.length; i++)
		{
		var doc = app.documents[i];
		displ.fname.text = doc.name;
		if (data.replace_index == true && doc.indexes.length > 0)
			doc.indexes[0].topics.everyItem().remove();
		if (doc.indexes.length == 0)
			doc.indexes.add ();
		for (var j = 0; j < data.styles.length; j++)
			{
			var prompt = doc.name + ': ' + data.styles[j];
			displ.fname.text = prompt;
			app.findGrepPreferences.appliedCharacterStyle = char_style_from_string ("", data.styles[j].split (' > '));
			var found = doc.findGrep();
			for (var k = found.length-1; k > -1; k--)
				{
				displ.fname.text = prompt + ' ' + k;
				try
					{
					if (data.prefix_stylename == true)
						var new_topic = doc.indexes[0].topics.add (data.styles[j] + "#" + found[k].contents);
					else
						var new_topic = doc.indexes[0].topics.add (found[k].contents);
					new_topic.pageReferences.add (found[k], PageReferenceType.currentPage);
					}
				catch(_) {/* not interested in errors */}
				}
			}
		}
	}


function select_character_styles (txt_file)
	{
	var cs_array = fetch_stylenames (app.activeDocument.allCharacterStyles);
	var w = new Window ('dialog', 'Character styles', undefined, {resizeable: true, closeButton: false});
	w.alignChildren = ['fill','fill'];
	var cs_list = w.add ('listbox', undefined, cs_array, {multiselect:true});
	cs_list.maximumSize.height = 500;
	var replace = w.add ('checkbox', undefined, ' Replace existing index');
	var prefix = w.add ('checkbox', undefined, ' Prefix style name to topics');
	var buttons = w.add ('group');
		buttons.alignChildren = ['right', 'bottom'];
		buttons.orientation = 'row';
		buttons.add ('button', undefined, 'OK', {name: 'ok'});
		buttons.add ('button', undefined, 'Cancel', {name:'cancel'});

	// read the stored settings and apply to dialog
	var previous = get_previous (txt_file);
	if (previous != null)
		{
		replace.value = previous.replace_index;
		prefix.value = previous.prefix_stylename;
		var chs = "|" + previous.styles.join ("|") + "|";
		// select character styles from the history file in the dialog
		for (var i = 0; i < cs_array.length; i++)
			if (chs.search ("|"+cs_array[i]+"|") > 0)
				cs_list.items[i].selected = true
		}

	function get_selected_styles (listbox)
		{
		var array = [];
		for (var i = 0; i < listbox.items.length; i++)
			if (listbox.items[i].selected)
				array.push (listbox.items[i].text)
		return array
		}

	function fetch_stylenames (all_names)
		{
			
			function fetch_path (s, str)
				{
				while (s.parent.constructor.name != 'Document')
					return fetch_path (s.parent, s.parent.name + ' > ' + str);
				return str;
				}
			
		for (var i = 0; i < all_names.length; i++)
			all_names[i] = fetch_path (all_names[i], all_names[i].name);
		all_names.shift();
		return all_names;
		}

	if (w.show () == 1)
		{
		var obj = {styles: get_selected_styles (cs_list), replace_index: replace.value, prefix_stylename: prefix.value};
		store_settings (txt_file, obj);
		w.close ();
		return obj;
		}
	exit ();
	}


function char_style_from_string (str, array)
	{
	str = "characterStyles.item ('" + array.pop() + "')";
	for (var i = array.length-1; i > -1; i--)
		str = "characterStyleGroups.item ('" + array[i] + "')." + str;
	return eval ('app.activeDocument.' + str);
	}


function script_dir()
	{
	try {return File (app.activeScript).path}
	catch (e) {return File (e.fileName).path}
	}


function get_previous (f)
	{
	if (f.exists)
		{
		f.open ('r');
		temp = f.read();
		f.close ();
		return eval (temp)
		}
	return null;
	}


function store_settings (f, obj)
	{
	f.open ('w');
	f.write (obj.toSource());
	f.close ();
	}


function errorM (m)
	{
	alert (m, 'Error', true);
	exit();
	}


function init_progress ()
	{
	var w = new Window ('palette', 'Index character styles' );
		w.alignChildren = ['left', 'top'];
		w.fname = w.add ('statictext {characters: 40}');
	return w;
	}
