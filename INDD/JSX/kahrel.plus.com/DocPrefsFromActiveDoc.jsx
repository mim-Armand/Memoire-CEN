//DESCRIPTION: Create a document preset from the active document
// Peter Kahrel -- 14 Oct. 2013

if (app.documents.length == 0){
	alert ('Open a document.');
	exit();
}

var name = prompt ('\r\rEnter a name for the new document preset:', "", 'Create new document preset');
if (name == null) exit();

var docPrefs = app.documents[0].documentPreferences;
var marginPrefs = app.documents[0].marginPreferences;

var props = {
	name: name,
	pagesPerDocument: docPrefs.pagesPerDocument,
	facingPages: docPrefs.facingPages,
	pageHeight: docPrefs.pageHeight,
	pageWidth: docPrefs.pageWidth,
	pageOrientation: docPrefs.pageOrientation,
	columnCount: marginPrefs.columnCount,
	columnGutter: marginPrefs.columnGutter,
	top: marginPrefs.top,
	bottom: marginPrefs.bottom,
	left: marginPrefs.left,
	right: marginPrefs.right,
	documentBleedInsideOrLeftOffset: docPrefs.documentBleedInsideOrLeftOffset,
	documentBleedTopOffset: docPrefs.documentBleedTopOffset,
	documentBleedOutsideOrRightOffset: docPrefs.documentBleedOutsideOrRightOffset,
	documentBleedBottomOffset: docPrefs.documentBleedBottomOffset,
	slugInsideOrLeftOffset: docPrefs.slugInsideOrLeftOffset,
	slugTopOffset: docPrefs.slugTopOffset,
	slugRightOrOutsideOffset: docPrefs.slugRightOrOutsideOffset,
	slugBottomOffset: docPrefs.slugBottomOffset,
	createPrimaryTextFrame: docPrefs.createPrimaryTextFrame,
	startPageNumber: docPrefs.startPageNumber,
	intent: docPrefs.intent,
	documentBleedUniformSize: docPrefs.documentBleedUniformSize,
	documentSlugUniformSize: docPrefs.documentSlugUniformSize,
	pageSize: docPrefs.pageSize
}

try {
	app.documentPresets.add (props);
} catch (e) {
	alert (e.message);
}
