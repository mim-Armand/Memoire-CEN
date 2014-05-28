// Description: Title case
// Peter Kahrel www.kahrel.plus.com
// An old script, tarted up in 2012

/*___________________________________________________________

The script converts text to title case.
Words in the text file "title_case_exceptions.txt" (which must be in the script folder) are ignored.

Five modes:

1. Insertion point in italic text: process just the italic text of the current paragraph.
2. Insertion point selected, not in italic text: try to find text in quotes in the current paragraph and process that.
3. Insertion point selected, not in italic text and not in quotes: do the ins. point's parent paragraph.
4. Selection is not an insertion point but some selected text: process whatever is selected.
5. Text frame selected: process the frame's parent story.
_____________________________________________________________*/

#target indesign

title_case ("title_case_exceptions.txt");

function title_case (exceptions)
	{
	if (app.selection.length == 0) exit();
	
	// Get the exceptions from the text file
	var ignore = find_exceptions (exceptions);
	if (app.selection[0] instanceof TextFrame)
		{
		process_story (app.selection[0].parentStory, ignore);
		return;
		}

	// If selection is insertion point and IP is italic, then do whatever is in italics.
	if (app.selection[0].constructor.name == 'InsertionPoint')
		{
		if (app.selection[0].fontStyle == 'Italic')
			var sel = get_italic_text (app.selection[0].paragraphs[0]);
		else
			{
			// If the ins. poit is embraced by quotes, return that,
			// otherwise return the whole paragraph
			var sel = get_quote (app.selection[0].paragraphs[0]);
			if (sel == null)
				sel = app.selection[0].paragraphs[0];
			}
		}
	else
		{
		// else do whatever is selected
		var sel = app.selection[0];
		}
	if (sel != null)
		sel.contents = apply_title_case (sel, ignore);
	}


// END ----------------------------------------------------------

function get_italic_text (par)
	{
	var first, last;
	first = last = app.selection[0].insertionPoints[0].index - par.insertionPoints[0].index;
	while (par.insertionPoints[first].fontStyle == 'Italic') first--;
	while (par.insertionPoints[last].fontStyle == 'Italic') last++;
	return par.characters.itemByRange (first, last-2);
	}


function get_quote (par)
	{
	// Try to match text in double quotes
	var s = par.contents;
	if (s.indexOf('\u201C') > -1 && s.indexOf('\u201D') > -1)
		return get_quote_sub (par, SpecialCharacters.DOUBLE_LEFT_QUOTE, SpecialCharacters.DOUBLE_RIGHT_QUOTE);
	if (s.indexOf('\u2018') > -1 && s.indexOf('\u2019') > -1)
		return get_quote_sub (par, SpecialCharacters.SINGLE_LEFT_QUOTE, SpecialCharacters.SINGLE_RIGHT_QUOTE);
	// No quotation marks, exit
	return null;
	}


function get_quote_sub (par, first_char, last_char)
	{
	var first, last;
	first = last = app.selection[0].insertionPoints[0].index - par.insertionPoints[0].index;
	while (par.characters[first].contents != first_char) first--;
	while (par.characters[last].contents != last_char) last++;
	return par.characters.itemByRange (first+1, last-1);
	}


function process_story (story, ignore)
	{
	app.findGrepPreferences = null;
	app.findGrepPreferences.fontStyle = 'Italic';
	var found = story.findGrep();
	for (var i = 0; i < found.length; i++)
		found[i].contents = apply_title_case (found[i], ignore);
	}


function apply_title_case (sel, ignore)
	{
	// Content returned by .itemsByRange() is an array,
	// content of a selection  or of found array items are strings
	if (sel.contents instanceof Array)
		sel = sel.contents[0];
	else
		sel = sel.contents;
		
	// Insert spaces after non-breaking spaces, quotes, forced line breaks, and opening parentheses.
	// If we don't, we won't be able to see the first letter of the word following them
	var temp = sel.replace (/([\u00A0\u2018\u201C\u000A(])/g, " $1 ");
	
	// Split selection into array of words
	var temp_array = temp.split (" ");
	
	// Upper-case all words in the array, skipping words filtered by "keep_low"
	for( var i = 0; i < temp_array.length; i++ )
		if (!keep_low (temp_array[i], ignore))
			temp_array[i] = init_upper (temp_array[i]);
	
	// String the array elements together into a sentence
	temp = temp_array.join (" ");
	
	// Remove the spaces we inserted as the first step
	temp = temp.replace (/ ([\u00A0\u2018\u201C\u000A(]) /g, "$1");
	
	// Capitalise any letter following a colon+space or a period+space
	temp = temp.replace (/([-:.] ?)(\w)/g, 
		function () {return (arguments[1]) + (arguments[2]).toUpperCase()});
	return temp;
	}


// Init-cap a single word
function init_upper (s)
	{
	try {return s[0].toUpperCase() + s.slice(1)}
		catch (_) {return s};
	}


// Check if a word should be ignored
function keep_low ( w, ignore )
	{
	try {return ignore.search ("|"+w+"|") >-1} 
		catch (_) {return false}
	}


function find_exceptions (s)
	{
	var f = File (script_dir () + "/" + s)
	if (f.exists)
		{
		f.open ("r");
		var temp = f.read ();
		f.close ();
		return "|" + temp.replace (/[\n\r]/g, "|") + "|"
		}
	else
		{
		alert ('Cannot find ' + s + ' in the script folder.', 'Error', true)
		exit ();
		}
	}


function script_dir()
	{
	try {return File (app.activeScript).path}
	catch (e) {return File (e.fileName).path}
	}