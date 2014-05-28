/*=====================================================================

Apply designated paragraph style to paragraphs whose first letter
changes from the previous paragraph. Provide the paragraph style's name
at "skip_style". To add section letters, set "insert_letter" to true.

Peter Kahrel -- www.kahrel.plus.com

=====================================================================*/

#target indesign

skip_style = 'index_skip';
insert_letter = true;

apply_skip_style (skip_style, insert_letter)


//=====================================================================


function apply_skip_style (s, ins)
	{
	var skipper = check_style (s);
	app.findGrepPreferences = null;
	app.findGrepPreferences.findWhat = "^.";
	found = app.activeDocument.findGrep ();
	for (i = found.length-1; i > 0; i--)
		{
		if (changed (found[i].contents, found[i-1].contents))
			{
			if (ins == true)
				found[i].contents = found[i].contents.toUpperCase() + '\r' + found[i].contents;
			found[i].paragraphs[0].applyParagraphStyle (app.activeDocument.paragraphStyles.item ("index_skip"), false);
			}
		}
	}


function changed (x, y) {return x.toLowerCase () != y.toLowerCase ()}


function check_style (s)
	{
	if (app.activeDocument.paragraphStyles.item (s) == null)
		errorM ('Cannot find paragraph style "' + s + '"');
	return app.activeDocument.paragraphStyles.item (s)
	}


function errorM (m) 
	{
	alert (m, "Error", true);
	exit ()
	}