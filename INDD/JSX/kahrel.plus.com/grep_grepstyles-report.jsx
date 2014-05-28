//DESCRIPTION: List all GREP styles defined in the active document
//Peter Kahrel -- www.kahrel.plus.com

#target indesign

if (parseInt (app.version) > 5 && app.documents.length > 0)
	grep_styles (app.documents[0]);

function grep_styles (source)
	{
	var gr = find_styles (source);
	if (gr.length > 0)
		{
		var template = open_document ();
		print_styles (template, gr);
		}
	else
		alert ("No GREP styles in this document.");
	}


function find_styles (doc)
	{
	var gstyles;
	var str = "";
	var no_gstyles = true;
	var pstyles = doc.paragraphStyles.everyItem().getElements();
//~ 	tf = app.documents[0].pages[0].textFrames.add ({geometricBounds: ["10mm", "10mm", "250mm", "200mm"]});
	for (var i = 0; i < pstyles.length; i++)
		{
		gstyles = pstyles[i].nestedGrepStyles.everyItem().getElements();
		if (gstyles.length > 0)
			{
			no_gstyles = false;
			str += "P-style: " + pstyles[i].name + "\r\r";
			for (var j = 0; j < gstyles.length; j++)
				{
				str += "Ch-style: " + gstyles[j].appliedCharacterStyle.name + "\r";
				str += "###" + gstyles[j].grepExpression + "\r\r";
				}
			}
		}
	if (no_gstyles == true)
		return "";
	else
		return str;
	}


function print_styles (doc, s)
	{
	var tf = doc.pages[0].textFrames.add ({geometricBounds: ["12.7mm", "12.7mm", "284.3mm", "197.3mm"]});
	tf.contents = s;
	add_pages (doc);
	app.findGrepPreferences = app.changeGrepPreferences = null;
	apply_styles ("^###", "find_what");
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = "^###";
	doc.changeGrep();
	}


function apply_styles (tag, stylename)
	{
	app.findGrepPreferences.findWhat = tag;
	try
		{
		app.changeGrepPreferences.appliedParagraphStyle = app.documents[0].paragraphStyles.item (stylename);
		app.changeGrep ()
		}
	catch (_) {}
	}

function open_document ()
	{
	try {app.open (File (script_dir () + "/grep_format.indd"))}
		catch (_) {app.documents.add ()}
	return app.documents[0]
	}


function script_dir()
	{
	try {return File (app.activeScript).path}
	catch (e) {return File (e.fileName).path}
	}


function add_pages (doc)
	{
	var m = doc.pages[0].marginPreferences;
	var gb = [m.top, m.left, 
		doc.documentPreferences.pageHeight - m.bottom, 
		doc.documentPreferences.pageWidth - m.right];
	var col = doc.pages[0].textFrames[0].textFramePreferences.textColumnCount;
	doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
	var n = 1;
	while (doc.pages[-1].textFrames[0].overflows)
		{
		doc.pages.add ().textFrames.add ({geometricBounds: gb, textFramePreferences: {textColumnCount: col}});
		doc.pages[-1].textFrames[0].previousTextFrame = doc.pages[-2].textFrames[0]
		}
	doc.layoutWindows[0].activePage = doc.pages[0];
	}