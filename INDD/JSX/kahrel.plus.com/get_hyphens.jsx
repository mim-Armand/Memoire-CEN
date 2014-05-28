
// © 2009 Teus de Jong and Peter Kahrel
// First version Heiligabend/Christmas Eve 2009
// Routines to collect broken words and page/line numbers are based on
// the Hyphenation checker for Windows made by Teus de Jong (see http://www.teusdejong.nl)
// Second version 2012, Peter Kahrel

#target indesign;
#targetengine wdivisions;

if (app.documents.length == 0) exit();

var WDIVISION = read_preferences ();
hyphenation_checker ();
WDIVISION.debug = false // enable/disable timers

WDIVISION.message = create_message_window();
WDIVISION.message.show();
WDIVISION.broken_words = collect_broken_words();
if (WDIVISION.filter)
	WDIVISION.broken_words = filter_exceptions (WDIVISION.broken_words);
output_broken_words ();
WDIVISION.message.close();

// End

function collect_broken_words ()
	{
	WDIVISION.t0 = get_time ();
	if (WDIVISION.from_file)
		return broken_words = load_file();
	else
		return broken_words = find_broken_words (app.documents[0]);
	} // collect_broken_words


function output_broken_words ()
	{
	if (WDIVISION.output == "Document")
		{
		WDIVISION.message.log.text = 'Placing hyphenated words in new document...'; 
		flow ();
		return;
		}
	WDIVISION.message.log.text = 'Preparing hyphenated words for display...';
	if (!WDIVISION.from_file && WDIVISION.sort)
		{
		if (WDIVISION.line_numbers)
			WDIVISION.broken_words = WDIVISION.broken_words.sort (sort_multi_m)
		else
			WDIVISION.broken_words = WDIVISION.broken_words.sort (sort_multi_0);
		}
	hyphen_dialog ();
	} // output_broken_words


// ==============================================================================

function find_broken_words ()
	{
	var broken = [];
	var fnotes, tables;
	var stories = app.documents[0].stories.everyItem().getElements();
	for (var i = 0; i < stories.length; i++)
		{
		if (stories[i].lines.length > 1)
			{
			broken = find_broken (stories[i], i, 0, 0, 0, broken); 
			if (WDIVISION.line_numbers)
				getnumbers(stories[i], broken, 0, i);
			fnotes = stories[i].footnotes.everyItem().getElements();
			for (var j = 0; j < fnotes.length; j++)
				if (fnotes[j].lines.length > 1)
					broken = find_broken (fnotes[j], i, 1, j, 0, broken);
			if (WDIVISION.line_numbers)
				getnumbers(stories[i], broken, 1, i);
			tables = stories[i].tables.everyItem().getElements();
			for (var j = 0; j < tables.length; j++)
				for (var k = 0; k < tables[j].cells.length; k++)
					if (tables[j].cells[k].lines.length > 1)
						broken = find_broken (tables[j].cells[k], i, 2, j, k, broken);
			if (WDIVISION.line_numbers)
				getnumbers(stories[i], broken, 2, i);
			}
		}
	return broken
	} // find_broken_words


function find_broken (obj, st_id, story_kind, fn_or_tb_num, cel_num, broken_words)
	{
	var part_1, part_2, w;
	WDIVISION.message.log.text = 'Fetching hyphenated words from story ' + st_id +'...';//!!
	var lines_ = obj.lines.everyItem().contents;
	var stop = lines_.length-1;
	for (var i = 0; i < stop; i++)
		{
		if (broken_line (lines_[i]))
			{
			part_1 = lines_[i].replace (WDIVISION.regex1, "");
			part_2 = lines_[i+1];
			if (part_2.indexOf('\n') > -1)
				part_2 = part_2.replace('\n', ' ').replace(WDIVISION.regex2, "");
			else
				part_2 = part_2.replace(WDIVISION.regex2, "");
			w = part_1+WDIVISION.separator+part_2;
			w = w.replace (WDIVISION.regex3, "");
			if ((w != WDIVISION.separator) && (w.indexOf(WDIVISION.separator) != 0) && (w.indexOf(WDIVISION.separator) != w.length-1))
				if (WDIVISION.line_numbers)
					broken_words.push ([w, st_id, story_kind, fn_or_tb_num, cel_num, i, 0, 0, 0, ''] );
				else
					broken_words.push ([w, st_id, story_kind, fn_or_tb_num, cel_num, i] );
			}
		}
	return broken_words
	} // find_broken

function broken_line (s)
	{
	return "- \u2013\u00AD\u05BE\r\n/".indexOf(s.slice (-1)) < 0;
	}

function getnumbers(obj, ar, type_, st_id)
	{
	var ver = Number(app.version.substr(0, 1) );
	var rec = [];
	var i, j, tf, aantal, totaantal, pname, lnnr, c;
	var ininline  = false;
	WDIVISION.message.log.text = 'Getting page and line numbers for story ' + st_id +'...'; 
	switch (type_)
		{
		case 0:
			{
			var startlines =[];
			aantal = (ver > 4) ? obj.textContainers.length : obj.textFrames.length;
			totaantal = -1;
			for (i = 0;  i < aantal; i++)
				{
				tf = (ver  > 4) ? obj.textContainers[i] : obj.textFrames[i];
				totaantal += tf.lines.length;
				try {pname = getParentPageName(tf, ver)}
					catch(_){ pname = '0'}
				ininline = ((aantal==1) && (tf.parent.constructor.name == 'Character'));
				if (ininline)
					{
					for (j = ar.length - 1; j >= WDIVISION.done; j--)
						{
						rec = ar[j];
						rec[6] = pname;
						rec[7] = rec[5]+1;
						rec[8] = 1;
						}
					break;
					}
				if ((startlines.count>0) && (startlines[startlines.length-1] [0] == pname))
					startlines[startlines.length-1][1] = totaantal;
				else
					startlines.push([pname, totaantal]);
				}
			if (ininline)
				break;
			var j = startlines.length-1;
			for (i = ar.length - 1; i >= WDIVISION.done; i--)
				{
				rec = ar[i];
				if (rec[2] != 0) continue;
				lnnr = rec[5];
				while ((startlines[j][1] >= lnnr) && (j>0))
					j--;
				rec[7] = (j>0) ? lnnr - startlines[j][1] : lnnr;
				if ((j==0) || (j==startlines.length-1))
					rec[6] =startlines[j][0];
				else
					rec[6] = startlines[j+1][0];
				}
			break;
			}
		case 1:
			{
			for (i = ar.length - 1; i >= WDIVISION.done; i--)
				{
				rec = ar[i];
				rec[7] = rec[5]+1;
				tf = obj.footnotes[rec[3]].lines[rec[5]].words[-1].parentTextFrames[0];
				try {pname = getParentPageName(tf, ver)}
					catch(_){ pname = '0'}
				rec[6] = pname;
				}
			break;
			}
		case 2:
			{
			for (i = ar.length - 1; i >= WDIVISION.done; i--)
				{
				rec = ar[i];
				rec[7] = rec[5]+1;
				c = obj.tables[rec[3]].cells[rec[4]]
				tf = c.lines[rec[5]].words[-1].parentTextFrames[0];
				try {pname = getParentPageName(tf, ver)}
					catch(_){ pname = '0'}
				rec[6] = pname;
				rec[9] = c.name.toString();
				}
			break;
			}
		}
	WDIVISION.done = ar.length;
	} // getnumbers


function getParentPageName(obj, ver){
	if (ver > 6) return (obj.parentPage.name);
	//  this simple construction is sufficient here for CS4 and earlier
	while (obj.constructor.name != 'Page')
		{
		if (obj.constructor.name == 'Character')
			obj = obj.parentTextFrames[0];
		obj = obj.parent;
		}
	return(obj).name;
} // getParentPageName

// Interactive list =====================================================================

function hyphen_dialog ()
	{
	var w = new Window ('palette {text: "Hyphenated words", properties: {closeButton: false}}');
		if (WDIVISION.debug) w.text += ' ('+WDIVISION.broken_words.length+'/'+time_diff(WDIVISION.t0)+' sec.)';
		w.location = WDIVISION.scrpos;
		var list = w.add ('listbox', undefined, words_only (WDIVISION.broken_words));
			list.minimumSize.width = 230;
			list.maximumSize.height = w.maximumSize.height-200;
		var buttons = w.add ('group');
			var savebutton = buttons.add ('button {text: "Save"}');
				savebutton.enabled = app.activeDocument.saved;
			var closebutton = buttons.add ('button {text: "Close"}');
		
		if (WDIVISION.list_index != -1)
			list.selection = list.items[WDIVISION.list_index];
		
		list.onDoubleClick = function ()
			{
			if (this.selection != null )
				select_word (WDIVISION.broken_words[this.selection.index])
			} 

		closebutton.onClick = function () 
			{
			WDIVISION.scrpos = w.location;
			write_history ();
			WDIVISION = {};
			w.close();
			}

		savebutton.onClick = function ()
			{
			WDIVISION.list_index = (list.selection == null) ? -1 : list.selection.index;
			save_list (WDIVISION.broken_words)
			}

	w.show ();
	}


function select_word (rec)
	{
//~ 	try
//~ 		{
		switch (Number(rec[2])) 
			{
			case 2:
				var word = app.documents[0].stories[rec[1]].tables[rec[3]].cells[rec[4]].lines[rec[5]].words[-1];
				break;
			case 1:
				var word = app.documents[0].stories[rec[1]].footnotes[rec[3]].lines[rec[5]].words[-1];
				break;
			case 0:
				var word = app.documents[0].stories[rec[1]].lines[rec[5]].words[-1];
			}
		if (word != null)
			{
			app.select (word, SelectionOptions.replaceWith );
			app.activeWindow.zoomPercentage = app.activeWindow.zoomPercentage
			}
//~ 		}
//~ 	catch (_) {}
	} // select_word


function save_list (l){
	var f = File (WDIVISION.hyphenation_file);
	f.encoding = 'UTF-8';
	f.open ('w');
	f.writeln (WDIVISION.list_index);
	if (WDIVISION.line_numbers) f.writeln(1) else f.writeln(0);
	if (WDIVISION.sort || WDIVISION.sorted) f.writeln(1) else f.writeln(0);
	f.writeln (WDIVISION.separator);
	for (var i  = 0; i < l.length; i++){
		f.writeln(l[i]);
	}
	f.close();
}


// Interface ========================================================================

function hyphenation_checker ()
	{
	var w = new Window ('dialog {text: "Hyphenation checker", properties: {closeButton: false}}')
		
		var main = w.add ('panel {alignChildren: "left"}');
			
			var g1 = main.add ('group {_: StaticText {text: "Output:"}, alignment: "right"}');
				var output = g1.add ('dropdownlist', undefined, ['Screen', 'Document']);
					output.preferredSize.width = 125;

			var g2 = main.add ('group {_: StaticText {text: "Separator:"}, alignment: "right"}');
				var separator = g2.add ('dropdownlist', undefined, ['Swung dash', 'Hyphen', 'En dash', 'Em dash', 'Underscore']);
					separator.preferredSize.width = 125;

			var from_file = main.add ('checkbox {text: "\u00A0Use list from text file"}');
			var sort = main.add ('checkbox {text: "\u00A0Sort list"}');
			var filter = main.add ('checkbox {text: "\u00A0Filter out the exception list"}');
			
			var doc_group = main.add ('group {orientation: "column", alignChildren: "left"}');
				var colums_group = doc_group.add ('group {_: StaticText {text: "Columns in document output:"}}');
					var columns = colums_group.add ('edittext');
					
			var line_numbers = doc_group.add ('checkbox {text: "\u00A0Include details in doc. output"}');
			var del_duplicates = doc_group.add ('checkbox {text: "\u00A0Delete duplicates in doc. output"}');

		var buttons = w.add ('group')
			buttons.add ('button', undefined, 'Cancel', {name: 'cancel'});
			buttons.add ('button', undefined, 'OK', {name: 'ok'});

	// set dialog values
	output.selection = output.find (WDIVISION.output);
	separator.selection = separator.find (WDIVISION.separator_name);
	from_file.enabled = from_file.value = File (WDIVISION.hyphenation_file).exists;
	sort.value = WDIVISION.sort;
	filter.value = WDIVISION.filter;
	columns.text = WDIVISION.columns;
	line_numbers.value = WDIVISION.line_numbers;
	del_duplicates.value = WDIVISION.del_duplicates;

	if (File (WDIVISION.hyphenation_file.exists))
		flip_controls;

	from_file.onClick = flip_controls;
	
	function flip_controls (){
		g2.enabled = sort.enabled = line_numbers.enabled = filter.enabled = !from_file.value;
		}
	
	output.onChange = function (){
		if (output.selection.text == 'Screen')
			doc_group.enabled = del_duplicates.value = line_numbers.value = false;
		else
			doc_group.enabled = true;
		}

	output.notify();
	
	del_duplicates.onClick = function () {
		if (del_duplicates.value) line_numbers.value = false;
		}
	
	line_numbers.onClick = function () {
		if (line_numbers.value) del_duplicates.value = false;
		}

	del_duplicates.notify(); del_duplicates.notify();

	if (w.show() == 1)
		{
		WDIVISION.output = output.selection.text;
		WDIVISION.separator_name = separator.selection.text;  // this one is for making a selection when the script starts
		WDIVISION.separator = ['~', '-', '–', '—', '_'][separator.selection.index];  // the character actually used
		WDIVISION.sort = sort.value;
		WDIVISION.line_numbers = line_numbers.value;
		WDIVISION.filter = filter.value;
		WDIVISION.from_file = from_file.value;
		WDIVISION.columns = columns.text;
		WDIVISION.del_duplicates = del_duplicates.value;
		write_history ();
		return;
		}
		exit(); // Esc/Cancel pressed
	}


// Read a list from a file ------------------------------------------------------------

function load_file (){
	WDIVISION.message.log.text = 'Loading hyphenated words from file...';
	var arretje = [];
	var broken = [];
	var f = File (WDIVISION.hyphenation_file);
	f.encoding = 'UTF-8';
	f.open('r');
	WDIVISION.list_index = f.readln();
	WDIVISION.line_numbers = f.readln() == 1;
	WDIVISION.sorted = f.readln() == 1;
	WDIVISION.separator = f.readln();
	while (!f.eof){
		arretje = f.readln().split(',');
		broken.push(arretje);
	}
	f.close();
	return broken;
}


function filter_exceptions (word_list)
    {
		
		function retrieve_exceptions()
			{
			var exceptions = {}, temp = [];
			var lg = find_language();
			lg = app.findKeyStrings(lg)[0].replace ("$ID/", "");
			var temp = app.userDictionaries.item(lg).addedWords;
			// remove swung dashes from the exceptions array
			for (var i = temp.length-1; i > -1; i--)
				exceptions[temp[i].replace (/~/g, "")] = true;
			return exceptions;
			}
		
	var pos, filtered = [], exceptions = retrieve_exceptions();

	for (var i = word_list.length-1; i > -1; i--)
		{
		if (!exceptions[word_list[i][0].replace("~","")])
			filtered.push (word_list[i]);
		}
    return filtered;
	} // filter_exceptions

// Write list in a new document (after sorting and deleting duplicates) --------------------------------------------------------

function flow ()
	{
	var array = [];
	if (WDIVISION.line_numbers)
		{
		if (WDIVISION.sort && !WDIVISION.sorted)
			array = WDIVISION.broken_words.sort (sort_multi_m);
		else
			array = WDIVISION.broken_words;
		array = getnumbered (array);
		}
	else
		{
		array = words_only (WDIVISION.broken_words);
		if (WDIVISION.del_duplicates)
			array = delete_duplicates (array);
		if (WDIVISION.sort && !WDIVISION.sorted)
			array.sort (nocase);
		}
		

	var s = make_string(array);
	var doc = app.documents.add();
	doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
	var marg = doc.pages[0].marginPreferences;
	var gb = [marg.top, marg.left, 
		app.documentPreferences.pageHeight - marg.bottom, 
		app.documentPreferences.pageWidth - marg.right];
	doc.textFrames.add ({geometricBounds: gb, contents: s, textFramePreferences: {textColumnCount: Number (WDIVISION.columns)}});
	while (doc.pages[-1].textFrames[0].overflows && doc.pages[-1].textFrames[0].contents != "")
		{
		doc.pages.add().textFrames.add ({geometricBounds: gb, textFramePreferences: {textColumnCount: Number (WDIVISION.columns)}});
		doc.pages[-1].textFrames[0].previousTextFrame = doc.pages[-2].textFrames[0];
		}
	} // flow


function getnumbered(ar)
	{
	var rec = [];
	var arretje= [];
	for (var i = 0; i < ar.length; i++)
		{
		rec = ar[i];
		rec[1] = '\u2002p. '+rec[6] ;
		if (Number(rec[2]) == 1)
			rec[1] = rec[1] + '; in footnote'
		else if (Number(rec[2]) == 2)
			{
			arretje = rec[9].split(/\D+/);
			arretje[0]++; arretje[1]++;
			rec[1] = rec[1] + '; in table, cell[r.'+arretje[0]+'; c.'+arretje[1]+']';
			}
		rec[1] = rec[1] + '; ln. '+rec[7];
		if (rec[8] == 1)
			rec[1] = rec[1] + '; in inline';
		rec.splice(2);
		}
	return ar;
	}
	
//------------------------------------------------------------------------------------------------------------------------------------------------

function make_string (array)
	{
//~ 	var str  = (WDIVISION.line_numbers) ?  array.join("\r")+"\r" : array.sort (nocase).join ("\r") +"\r";
//~ 	str = str.replace (/([^\r]+\r)(\1)+/g, "$1");
//~ 	if (WDIVISION.line_numbers) str = str.replace(/,/g, "");
//~ 	return str.replace (/\r$/,"");
	return array.join('\r')
	}


function nocase (a, b)
	{
	return a.toLowerCase() > b.toLowerCase()
	}


function words_only (array)
	{
	var temp = [];
	for (var i = 0; i < array.length; i++)
		temp.push(array[i][0]);
	return temp;
	}


function sort_multi_0 (a, b)
	{
	var x = a[0].toLowerCase();
	var y = b[0].toLowerCase ();
	if (x != y)
		return  x > y;
	else
		{
		x = a[1];
		y = b[1];
		if (x != y)
			return x > y
		else
			return a[5] > b[5];
		}
	}

function sort_multi_m (a, b)
	{
	var x = a[0].toLowerCase();
	var y = b[0].toLowerCase ();
	if (x == y)
		{
		if ((x = ("00000" + a[6]).slice (-6)) == (y = ("00000" + b[6]).slice (-6)))
			return (a[7] > b[7])
		else return(x > y);
		}
	else
		return(x > y);
	}

// Tools ==========================================================================


function read_preferences ()
	{
	var history_file = script_dir()+'/get_hyphens.txt';
	var obj = read_history (File (history_file));
	obj.scrpos = obj.scrpos.split(',');
	// Add some more globals
	obj.hyphenation_file = String(app.activeDocument.fullName).replace (/\.indd$/, '_hyphens.txt');
	obj.regex1 = /^.+[-\s]/;
	obj.regex2 = /[-\s].+$/;
	obj.regex3 = /['".,;:«»†‡®©‹›\[\]\{\}!?()0-9\u2018\u2019\u201C\u201D\uFEFF\uFFFC\u0004\u0016\/\r\n]/g;
	obj.list_index = -1;
	obj.done = 0;  // not sure what this one is for
	obj.sorted = false;  // not sure what this one is for; probably read from the hyph. file
	return obj;
	}



function read_history (f)
	{
	if (f.exists)
		{
		f.open ('r');
		var temp = f.read();
		f.close ();
		return eval (temp);
		}
	else
		{
		return {output: 'Screen',
					separator_name: 'Swung dash',
					sort: true,
					line_numbers: true,
					filter: false,
					scrpos: '30,40',
					columns: '2'
					}
		}
	} // read_history


function write_history ()
	{
	var f = File (script_dir()+'/get_hyphens.txt');
	// we don't want to store everything in the objct
	var obj = {output: WDIVISION.output,
					separator_name: WDIVISION.separator_name,
					sort: WDIVISION.sort,
					line_numbers: WDIVISION.line_numbers,
					filter: WDIVISION.filter,
					scrpos: WDIVISION.scrpos.toString(),
					columns: WDIVISION.columns,
					del_duplicates: WDIVISION.del_duplicates
					}
	f.open ('w');
	f.write (obj.toSource());
	f.close();
	}


function delete_duplicates (array)
	{
	var temp = [], known = {};
	for (var i = 0; i < array.length; i++)
		{
		if (!known[array[i]])
			{
			temp.push (array[i]);
			known[array[i]] = true;
			}
		}
	return temp;
	}


function script_dir ()
	{
	try {return File (app.activeScript).path + '/'}
	catch (e) {return File (e.fileName).path + '/'}
	}


function create_message_window ()
	{
	var m = new Window ('palette');
		m.log = m.add ('statictext');
		m.log.preferredSize.width = 300;
	return m;
	}


function get_time () {return new Date().getTime()}
function time_diff (start) {return (new Date() - start) / 1000}


function find_language ()
    {
    var lg;
    try {lg = app.selection[0].appliedParagraphStyle.appliedLanguage.name}
    catch (_)
        {
        try {lg = app.selection[0].parentStory.appliedLanguage.name}
        catch (_)
            {
            try {lg = app.documents[0].textDefaults.appliedParagraphStyle.appliedLanguage.name}
            catch (_) {lg = app.textDefaults.appliedParagraphStyle.appliedLanguage.name}
            }
        }
    return lg;
    }
