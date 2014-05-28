#target indesign;

if (app.selection.length > 0 && app.selection[0].parent instanceof Footnote)
	{
	try {footnote_in_breakline (app.selection[0]);}
	catch (e) {alert (e.message + " (line" + e.line + ")");}
	}


function footnote_in_breakline (sel)
	{
	var restoreView = setView (app.documents[0]);
	var break_style = pstyle ();
	var fnotes = sel.parentTextFrames[0].footnotes.everyItem().getElements();
	var footn = sel.parent;
	var data = {break_style: break_style,
						space: 2*break_style.pointSize,
						notes: fnotes,
						index: footn.index-fnotes[0].index,
						left_to_right: sel.paragraphDirection == ParagraphDirectionOptions.leftToRightDirection
						}
	// Set the selected note in the previous note's breakline
	note_to_inline (footn, get_indent (footn, data), data);
	
	// If this is a re-run, there may be more inline notes in the same cluster
	if (data.index < fnotes.length-1)
		{
		var next_note = fnotes[++data.index];
		while (data.index < fnotes.length && next_note.paragraphs[0].appliedParagraphStyle.name.search (/_breakline$/) > -1)
			{
			note_to_inline (next_note, get_indent (next_note, data), data);
			next_note = fnotes[++data.index];
			}
		}
	restoreView();
	} // footnote_in_breakline


function note_to_inline (footn, indent, data)
	{
	fn_par = footn.paragraphs[0];
	fn_par.applyParagraphStyle (data.break_style, false);
	if (data.left_to_right) {fn_par.leftIndent = 0;}
		else {fn_par.rightIndent = 0;}
	fn_par.firstLineIndent = indent;
	}


function get_indent (fn, data)
	{
	if (data.index == 0){
		alert ('Two move note 2 immediately after note 1, place the cursor in note 2, then run the script.')
		exit();
		}
	var previous_note = data.notes[data.index-1].paragraphs[0];
	if (data.left_to_right)
		{
		var end = previous_note.lines[-1].insertionPoints[-1].horizontalOffset
		var start = previous_note.parentTextFrames[0].geometricBounds[1];
		}
	else
		{
		var start = previous_note.lines[-1].insertionPoints[-1].horizontalOffset;
		var end = previous_note.lines[-1].parentTextFrames[0].geometricBounds[3];
		}
	return (end-start)+data.space;
	}


function pstyle ()
	{
	var doc = app.documents[0];
	var sname = doc.footnoteOptions.footnoteTextStyle.name.replace (/[\[\]]/g,"") + "_breakline";
	if (app.activeDocument.paragraphStyles.item (sname) == null)
		{
		var s = doc.footnoteOptions.footnoteTextStyle;
		if (doc.characterStyles.item(sname) == null)
			doc.characterStyles.add ({name: sname, leading: 0});
		var temp = doc.paragraphStyles.add ({name: sname});
		temp.basedOn = s;
		temp.nestedLineStyles.add ({appliedCharacterStyle: doc.characterStyles.item(sname), lineCount: 1});
		}
	return doc.paragraphStyles.item (sname)
	}



function setView (doc){
	var viewPrefs = doc.viewPreferences.properties;
	doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
	doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
	doc.zeroPoint = [0,0];
	return function () {doc.viewPreferences.properties = viewPrefs;}
}