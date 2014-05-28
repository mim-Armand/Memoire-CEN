#target indesign;

try {undo_breaklines ();}
catch (_){};

function undo_breaklines ()
	{
	var doc = app.activeDocument;
	var fn_style = doc.footnoteOptions.footnoteTextStyle;
	var break_style = doc.paragraphStyles.item (fn_style.name.replace (/[\[\]]/g,"") + "_breakline");
	if (break_style != null)
		{
		app.findGrepPreferences = null;
		app.findChangeGrepOptions.includeFootnotes = true;
		app.findGrepPreferences.appliedParagraphStyle = break_style;
		var f = doc.findGrep();
		for (var i = f.length-1; i > -1; i--)
			{
			f[i].applyParagraphStyle (fn_style, false);
			f[i].leftIndent = fn_style.leftIndent;
			f[i].firstLineIndent = fn_style.firstLineIndent;
			} // for
		} // if
	} // undo_breaklines