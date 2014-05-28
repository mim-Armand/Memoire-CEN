//DESCRIPTION: transfer GREP strings from Find/Change dialog to document
// Peter Kahrel -- www.kahrel.plus.com

#target indesign

if (parseInt (app.version) > 4 && app.documents.length > 0
	&& app.selection[0] instanceof InsertionPoint)
		dialog_to_doc (app.selection[0]);


function dialog_to_doc (sel)
	{
	sel.contents = app.findGrepPreferences.findWhat;
	try {sel.appliedParagraphStyle = app.documents[0].paragraphStyles.item ("find_what")} catch (_){};
	app.selection[0].contents = "\r" + app.changeGrepPreferences.changeTo;
	try {app.selection[0].appliedParagraphStyle = app.documents[0].paragraphStyles.item ("change_to")} catch (_){};
	}