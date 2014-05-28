#target indesign;

var inline_space = "\u2003\u2003";

if (app.selection.length > 0 && app.selection[0].parent instanceof Footnote)
    try {footnote_in_breakline (app.selection[0].parent)}
        catch (e) {alert (e.message + " (" + e.line + ")")};


function footnote_in_breakline (footn)
	{
	footn.insertionPoints[-1].contents = inline_space;
	var next_note = footn.parent.footnotes.nextItem (footn).paragraphs[0];
	next_note.applyParagraphStyle (pstyle (footn), false);
	next_note.leftIndent = end_of_line (footn);
	}


function pstyle (f)
	{
	var doc = app.documents[0];
	var s = doc.footnoteOptions.footnoteTextStyle;
	if (doc.paragraphStyles.item (s.name + "_breakline") == null)
		{
		var temp = doc.paragraphStyles.add ({name: s.name + "_breakline"});
		temp.basedOn = s;
		temp.leading = 0;
		}
	return doc.paragraphStyles.item (s.name + "_breakline")
	}
		

function end_of_line (f)
	{
	return f.insertionPoints[-1].horizontalOffset -
				f.insertionPoints[0].parentTextFrames[0].geometricBounds[1];
	}