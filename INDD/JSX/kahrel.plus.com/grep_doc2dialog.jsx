//DESCRIPTION: create GREP strings for Find/Change dialog
// Peter Kahrel -- www.kahrel.plus.com

#target indesign

if (parseInt (app.version) > 4 && app.documents.length > 0
	&& (app.selection[0] instanceof TextFrame 
	|| app.selection[0] instanceof InsertionPoint
	|| app.selection[0] instanceof Text))
		doc_to_dialog (app.selection[0]);


function doc_to_dialog (sel)
	{
	var find_grep = get_string (sel, "find_what");
	var change_grep = get_string (sel, "change_to");
	if (find_grep != "")
		app.findGrepPreferences.findWhat = find_grep;
	if (change_grep != "")
		app.changeGrepPreferences.changeTo = change_grep;
	}


function get_string (sel, stylename)
	{
	var gr = single_string (sel, stylename);
	gr = gr.replace (/\s\/\/.*?\r/g, "");
	gr = gr.replace (/[\t\r]/g, "");
	return gr
	}


function single_string (sel, stylename)
	{
	var pstyle = find_style (stylename);
	var s = "";
	var par = sel.paragraphs;
	for (var i = 0; i < par.length; i++)
		if (par[i].appliedParagraphStyle == pstyle)
			s += par[i].contents;
	return s
	}


function find_style (s)
	{
	if (app.documents[0].paragraphStyles.item (s) == null)
		errorM ('Need a paragraph style called "' + s + '"');
	return app.documents[0].paragraphStyles.item (s);
	}


function errorM (m)
	{
	alert (m);
	exit ();
	}