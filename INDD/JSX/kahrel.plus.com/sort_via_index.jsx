//DESCRIPTION: Sort a list using InDesign's index
// Peter kahrel -- www.kahrel.plus.com

#target indesign;

main ();

function main ()
	{
	try {story = app.selection[0].parentStory}
		catch (_) {alert ('Select a text frame or an insertion point.'); exit()}

	prepare_document();

	var index = app.documents[0].indexes.add();
	var p = story.contents.split("\r");
	for (var i = 0; i < p.length; i++)
		index.topics.add (p[i]);

	story.contents = app.activeDocument.indexes[0].topics.everyItem().name.join('\r');
	}


function prepare_document()
	{
	app.panels.item('Index').visible=false;  // an open Index panel slows down the script
	// remove any existing topics
	try {app.documents[0].indexes[0].topics.everyItem().remove()} catch(_){}
	app.findGrepPreferences = app.changeGrepPreferences = null;
	change ("^\x20+", ""); // delete leading spaces
	change ("\\r\\r+", "\r"); // remove blank lines
	change ("\\A\\s+", ""); // remove story-leading white space
	change ("\\s+\\Z", ""); // remove story-trailing white space
	}

function change (f, r)
	{
	app.findGrepPreferences.findWhat = f;
	app.changeGrepPreferences.changeTo = r;
	app.activeDocument.changeGrep();
	}
