//DESCRIPTION: Set endnote start number
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;
if (parseInt (app.version) > 5 && app.documents.length > 0 && 
	app.selection.length > 0 && app.selection[0] instanceof InsertionPoint)
	{
	new_start = prompt ('\r\r\rStart endnote numbering at:', '1', 'Renumber endnotes');
	if (new_start != null && new_start.match (/^\d+$/) != null)
		{
		app.selection[0].paragraphs[0].numberingStartAt = Number (new_start);
		app.documents[0].crossReferenceSources.everyItem().update();
		}
	}