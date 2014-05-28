//DESCRIPTION: Exchange commas and periods in numbers
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;

try {main ()}
catch (_){alert ("Can't run.")}

function main (){
	function FindItems (){
		if (app.selection.length == 0) {return app.activeDocument.findGrep();}
		if (app.selection[0].hasOwnProperty ("baseline")) {return app.selection[0].findGrep();}
		if (app.selection[0] instanceof TextFrame) {return app.selection[0].parentStory.findGrep();}
		exit ();
	} // FindItems

	// BEGIN main
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "\\d+[,.\\d]+\\d+";
	var Found = FindItems ();
	var Temp;
	for (var i = Found.length-1; i >= 0; i--)
		{
		Temp = Found[i].contents.replace (/,/g, "#");
		Temp = Temp.replace (/\./g, ",");
		Found[i].contents = Temp.replace (/#/g, ".")
		}
	} // main


