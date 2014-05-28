/*
	Manage the space between the first footnote on a page and the text.
	The script makes use of the fortunate circumstance that a frame
	whose wrap is set pushes away text but not notes. It therefore places
	an empty textframe on the note and applies wrapping. The script measures
	the line height of the main text and in effect creates a line of space
	between the first note and the text. Adjustments to the space can be made 
	by resizing the frame.
	
	For best results, set the minumum space before first footnote to zero 
	(in the document's footnote options, Layout tab)
	
	Peter Kahrel, February 2008

*/

#target indesign

if (app.selection.length == 0)
	exit();

//current_measure = set_measure (MeasurementUnits.points);
// reference to selected frame
frame = get_frame (app.selection[0]);
gb = frame.geometricBounds;
bottom_text = frame.lines[-1].baseline;
// add frame on selected page
spacer = frame.parent.textFrames.add ();
spacer.textWrapPreferences.textWrapType = TextWrapTypes.jumpObjectTextWrap;
spacer_top = bottom_text - get_leading (frame.lines[-1]);
// size and move the frame; make it 60 points wide
spacer.geometricBounds = [spacer_top, gb[1], gb[2], gb[1]+60];
//restore_measure (current_measure);


function get_frame (sel)
	{
	if (sel instanceof TextFrame)
		return sel;
	if (sel instanceof InsertionPoint)
		return sel.parentTextFrames[0];
	alert ('Select a text frame\ror an insertion point.');
	exit()
	}


function get_leading (line)
	{
	var pstyle = line.appliedParagraphStyle;
	if (pstyle.leading == Leading.auto)
		return pstyle.pointSize * (pstyle.autoLeading/100);
	else
		return pstyle.leading;
	}


function set_measure (unit)
	{
	var doc = app.activeDocument;
	var v_measure = doc.viewPreferences.verticalMeasurementUnits;
	doc.viewPreferences.verticalMeasurementUnits = unit;
	return v_measure
	}


function restore_measure (unit)
	{
	app.activeDocument.viewPreferences.verticalMeasurementUnits = unit
	}