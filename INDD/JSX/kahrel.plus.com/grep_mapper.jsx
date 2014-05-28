//DESCRIPTION: Enter Unicode ranges in the active document
// Peter Kahrel 2009 www.kahrel.plus.com

#target indesign;

// Only CS3 and later
if (parseInt (app.version) < 5)
	exit ();

unicode_ranges ();

function unicode_ranges ()
	{
	if (parseInt (app.version) == 5)
		var data = find_data ('grep_mapper_cs3.txt');
	else
		var data = find_data ('grep_mapper_cs4.txt');
	var selected = select_ranges (data.ranges);
	open_template (data.template)
	print_range (selected);
	app.activeWindow.activePage = app.activeDocument.pages[0];
	app.activeWindow.screenMode = ScreenModeOptions.previewToPage;
	app.activeWindow.zoom (ZoomOptions.fitSpread);
	app.activeDocument.textFrames[0].select();
	}

function print_range (array) // two-dim array, ranges, headings
	{
	mess = message_window (30);
	var to_print = [];
	var latin_check 
	for (var i = 0; i < array[0].length; i++)
		{
		to_print.push (array[1][i]);
		var start = array[0][i].split ('-')[0];
		var stop = array[0][i].split ('-')[1];
		for (var j = start; j <= stop; j++)
			{
			mess.text = start + '-' + stop;
			to_print.push (pad (j.toString(16)) + '\t' + String.fromCharCode (j))
			}
		to_print.push ('')
		}
	mess.text = 'Writing...';
	app.activeDocument.pages[0].textFrames[0].parentStory.contents = to_print.join ('\r');
	// Remove spurious returns after \n and \r
	if (array[1][0] == 'Latin')
		del_returns ();
	if (app.activeDocument.pages[0].textFrames[0].overflows)
		add_pages (app.activeDocument);
	}


// Remove empty lines at 00D0 and 00A0 (\r and \n)
function del_returns ()
	{
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "(?<=(000D|000A)\\t[\\n\\r])\\r";
	app.changeGrepPreferences.changeTo = "";
	app.activeDocument.changeGrep()
	}


function pad (s)
	{
	return ('000'+s).slice(-4).toUpperCase()
	}

function select_ranges (array)
	{
	var labels_and_headings = get_labels (array);
	var labels = labels_and_headings[0];
	var headings = labels_and_headings[1];
	var w = new Window ('dialog', 'Unicode ranges', undefined, {resizeable: true});
	w.alignChildren = ['right', 'bottom'];
	var ranges = w.add ('listbox', undefined, labels, {multiselect: true});
	ranges.maximumSize.height = 1000;
	var buttons = w.add ('group');
		buttons.orientation = 'row';
		okButton = buttons.add ('button', undefined, 'OK', {name: 'ok'});
		buttons.add ('button', undefined, 'Cancel', {name:'cancel'});
	if (w.show () == 1)
		return get_selected (ranges, headings)
	else
		exit();
	}


function get_labels (array)
	{
	var labels = [];
	var headings = [];
	var temp;
	for (var i = 0; i < array.length; i++)
		{
		temp = array[i].split (' /');
		labels.push (temp[0]);
		headings.push (temp[1]);
		}
	return [labels, headings]
	}


function get_selected (listbox, heading_array)
	{
	var ranges = [];
	var headings = [];
	for (var i = 0; i < listbox.items.length; i++)
		{
		if (listbox.items[i].selected)
			{
			ranges.push (listbox.items[i].text.match (/\((0x[^\)]+)/)[1]);
			headings.push (heading_array[i])
			}
		}
	return [ranges, headings]
	}


function find_data (f)
	{
	var dir = script_dir () + '/';
	var infile = File (dir+f);
	// Try and find the file with ranges
	if (!infile.exists)
		errorM ('Cannot find ' + f + ' in the script folder.');
	infile.open ('r');
	var file_contents = infile.read ();
	infile.close ();
	// split the file's contents into an array
	// the first line is a filename, pointing to the template
	file_contents = file_contents.split (/[\r\n]/);
	var template = file_contents.shift ();
	if (template.search ('/') > -1)
		dir = "";
	if (!File (dir+template).exists)
		errorM ('Cannot find template: ' + template);
	return {template: dir+template, ranges: file_contents}
	}


function open_template (s)
	{
	app.scriptPreferences.userInteractionLevel = 
		UserInteractionLevels.neverInteract;
	app.open (File (s));
	app.scriptPreferences.userInteractionLevel = 
		UserInteractionLevels.interactWithAll;
	app.activeDocument.textPreferences.typographersQuotes = false;
	return app.activeDocument
	}


function add_pages (doc)
	{
	mess.text = 'Adding pages...';
	var u = undefined;
	var m = app.activeDocument.pages[0].marginPreferences;
	var gb = [m.top, m.left, 
		doc.documentPreferences.pageHeight - m.bottom, 
		doc.documentPreferences.pageWidth - m.right];
	var col = doc.pages[0].textFrames[0].textFramePreferences.textColumnCount;
	doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
	var n = 1;
	while (doc.pages[-1].textFrames[0].overflows)
		{
		mess.text = 'Adding pages...' + String(n++);
		doc.pages.add ().textFrames.add (/*u,u,u,*/ {geometricBounds: gb, textFramePreferences: {textColumnCount: col}});
		doc.pages[-1].textFrames[0].previousTextFrame = 
			doc.pages[-2].textFrames[0]
		}
	}


function script_dir ()
	{
	try {return File (app.activeScript).path}
	catch (e) {return File (e.fileName).path}
	}


function message_window (le)
	{
	dlg = new Window ('palette');
	dlg.alignChildren = ['left', 'top'];
	txt = dlg.add ('statictext', undefined, '');
	txt.characters = le;
	dlg.show();
	return txt
	}


function errorM (m)
	{
	alert (m);
	exit()
	}