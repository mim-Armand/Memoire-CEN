// Collect broken words and place them (sorted, duplicates removed, exception list filtered out) in a new document

#target indesign;

if (app.documents.length > 0)
    {
    try {collect_broken_words ()}
        catch (e) {alert (e.message + "\r(line " + e.line + ")")};
    }


function collect_broken_words ()
    {
	var COLLECT = response();
    if (COLLECT.scope == 'All documents')
        {
        var broken_words = [];
        for (var i = 0; i < app.documents.length; i++)
            broken_words = broken_words.concat (find_broken_words (app.documents[i]));
        }
    else
		{
		var broken_words = find_broken_words (app.activeDocument);
		}
	if (COLLECT.filter == true)
		broken_words = filter_exceptions (broken_words);
	if (COLLECT.sortlist == true)
		broken_words.sort(nocase);
    var output = flow (broken_words.join ("\r"), COLLECT.columns);
    } // collect_broken_words


//~ function check_exceptions (word_list)
//~     {
//~     var pos;
//~     var word_list = del_duplicates (word_list);
//~     var lg = find_language ();
//~     lg = app.findKeyStrings (lg)[0].replace ("$ID/", "");
//~     var exceptions = app.userDictionaries.item (lg).addedWords;
//~     // create array (dashless) of words in the exception list with all swung dashes removed
//~     var dashless = exceptions.join ("£").replace (/~/g, "").split ("£");
//~     for (var i = word_list.length-1; i > -1; i--)
//~         {
//~         pos = binsearch (word_list[i].replace ("~", "").toLowerCase(), dashless);
//~         if (pos > 0)
//~             word_list.splice (i, 1);
//~         }
//~     return word_list;
//~     
//~ 	
	function del_duplicates (array)
		{
		var filtered = [], known = {};
		for (var i = array.length-1; i > -1; i--)
			{
			if (!known[array[i]])
				{
				known[array[i]] = true;
				filtered.push (array[i]);
				}
			}
		return filtered
		}
//~     } // check_exceptions



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
	var word_list = del_duplicates (word_list);
	for (var i = word_list.length-1; i > -1; i--)
		{
		if (!exceptions[word_list[i][0].replace("~","")])
			filtered.push (word_list[i]);
		}
    return filtered;
	} // filter_exceptions




    function nocase (a, b)
        {
        return a.toLowerCase () > b.toLowerCase ()
        }
	

function find_broken_words (doc)
    {
    var broken = [];
    var fnotes, j;
    var stories = doc.stories.everyItem ().getElements ();
    for (var i = 0; i < stories.length; i++)
        {
        if (stories[i].lines.length > 1)
            {
            broken = find_broken (stories[i], broken); 
            fnotes = stories[i].footnotes.everyItem().getElements();
            for (j = 0; j < fnotes.length; j++)
                if (fnotes[j].lines.length > 1)
                    broken = find_broken (fnotes[j], broken);
            }
        }
    return broken
    }


function find_broken (obj, array)
    {
    var part_1, part_2, w;
    var lines_ = obj.lines.everyItem().contents;
    var stop = lines_.length-1;
	var re1 = /^.+[\s\u002F\u2013\u2014]/;
	var re2 = /[\s\u002F\u2013\u2014].+$/;
	var re_del = /[.,;:«»†‡®©‹›\[\]\{\}!?()0-9\u2018\u2019\u201C\u201D\/\r\n]/g;
    for (var i = 0; i < stop; i++)
        {
        if (broken_line (lines_[i]))
            {
            part_1 = lines_[i].replace (re1, "");
            part_2 = lines_[i+1].replace (re2, "");
            w = part_1+"~"+part_2;
            w = w.replace (re_del, "");
            array.push (w)
            }
        }
    return array
    }


function broken_line (s)
    {
    return "- \u2013\u2014\u00AD\r/".search (s.slice (-1)) < 0;
    }



// Write array in a new document (after sorting and deleting duplicates)

function flow (s, col)
	{
	var doc = app.documents.add();
	doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
	var marg = doc.pages[0].marginPreferences;
	var gb = [marg.top, marg.left, 
		app.documentPreferences.pageHeight - marg.bottom, 
		app.documentPreferences.pageWidth - marg.right];
	doc.textFrames.add ({geometricBounds: gb, contents: s, textFramePreferences: {textColumnCount: col}});
	while (doc.pages[-1].textFrames[0].overflows && doc.pages[-1].textFrames[0].contents != "")
		{
		doc.pages.add().textFrames.add ({geometricBounds: gb, textFramePreferences: {textColumnCount: col}});
		doc.pages[-1].textFrames[0].previousTextFrame = doc.pages[-2].textFrames[0];
		}
    return doc;
	}


function binsearch (srch, array)
    {
    return binsearch_sub (srch, array, 0, array.length-1)
    }


function binsearch_sub (srch, array, first, last)
    {
    var temp, middle;
    middle = Math.round ((first + last) / 2);
    if (first > last)
        temp = -1;
    else
        if (array[middle] == srch)
            temp = middle;
        else
            if (array[middle] > srch)
                temp = binsearch_sub (srch, array, first, middle-1);
            else
                temp = binsearch_sub (srch, array, middle+1, last);
    return temp
    }



// Find the applied language: if there's a selection, return the language of the applied paragraph style; otherwise if there's a document,
// return the language of the default paragraph style; if that doesn't work, return the language of the application's default paragraph style.

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


function response ()
	{
	var docs = ['Active document'];
	if (app.documents.length > 1) docs = ['Active document', 'All documents'];
	var w = new Window ('dialog {text: "Collect word breaks", properties: {closeButton: false}}');
		var main = w.add ('panel {alignChildren: "left"}');
		
			var grp = main.add ('group');
				grp.add ('statictext {text: "Search: "}');
				var scope = grp.add ('dropdownlist', undefined, docs);
				scope.selection = 0; scope.preferredSize.width = 200;
				
			var filter = main.add ('checkbox {text: "\u00A0Filter out words from the user dictionary", value: true}');
			
			var output = main.add ('group');
				var sortlist = output.add ('checkbox {text: "\u00A0Sort output", value: true}');
				output.add ('statictext {text: "\u2003Print output in"}');
				var columns = output.add ('edittext {text: "2"}');
				output.add ('statictext {text: "columns"}');
			
		var buttons = w.add ('group {alignment: "right"}');
			buttons.add ('button {text: "Cancel", properties: {name: "cancel"}}');
			buttons.add ('button {text: "OK", properties: {name: "ok"}}');
			
	if (w.show() == 1)
		return {scope: scope.selection.text,
						sortlist: sortlist.value,
						filter: filter.value,
						columns: Number (columns.text)
					}
	exit ();
	}


function get_time () {return new Date().getTime()}
function time_diff (start) {return (new Date() - start) / 1000}
