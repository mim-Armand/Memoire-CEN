//DESCRIPTION: convert footnotes to dynamic (cross-referenced) column notes
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;

// Only CS4 and later
if (parseInt (app.version) > 5 && app.documents.length > 0)
    try {foot_to_column (app.documents[0])}
        catch (e) {alert (e.message + "\r(line " + e.line + ")")};

//-----------------------------------------------------------------------------------------------

function foot_to_column (doc)
    {
    var position = ask_position ();
    var endnote, endnote_link, cue;
    // set the separator text to null. Sep. "text" will be handled by the paragraph numbering style
    doc.footnoteOptions.separatorText = "";
    // get the paragraph style used for the notes
    var p_style = numbered_style (doc.footnoteOptions.footnoteTextStyle);
    // and the character style for the note references in the text
    var char_style = find_reference_style (doc, p_style);
    var story = find_story (doc);
    var footn = story.footnotes;
    // Place a frame at the foot of every right-hand side column,
    // beginning at the page where the first footnote is
    // return the (as yet) empty story for the column notes
    var target_story = create_frames (doc, p_style, position, footn[0]);
    // Create cross-ref format
    var cr_format = add_crossref ("column_note", char_style);
    // Move all footnotes to the column-note story, creating cross-refs
    for (var i = 0; i < footn.length; i++)
        {
        endnote = footn[i].texts[0].move (LocationOptions.after, target_story.insertionPoints[-1]);
        target_story.insertionPoints[-1].contents = "\r";
        endnote_link = doc.paragraphDestinations.add (endnote.insertionPoints[0]);
        cue = doc.crossReferenceSources.add (footn[i].storyOffset, cr_format);
        doc.hyperlinks.add (cue, endnote_link, {visible: false});
        }
    // the script adds a \r after each note; delete the last one
    target_story.characters[-1].remove ();
    // delete all note markers
    delete_notemarkers (doc);
    doc.crossReferenceSources.everyItem().update();
    // Give the note references a background colout so they're easy to spot
    colourise_cues (doc, char_style);
    }


// Create empty frames for the notes ================================================

function create_frames (doc, par_style, position, first_note)
    {
    // set units to points and ruler to page
    var view_prefs = set_view (doc);
    // get the coordinates for the note frames
    var gb = frame_coordinates (doc, position);
    // create an object style for the notes
    var frame_style = add_frame_style (doc, par_style);
    // First frame must be done separately (rest of the frames look back, first frame can't do that)
    if (parseInt (app.version) > 6)
        var start = first_note.storyOffset.parentTextFrames[0].parentPage.documentOffset;
    else
        var start = first_note.storyOffset.parentTextFrames[0].parent.documentOffset;
    var first_frame = place_frame (doc, start, gb, frame_style);
    // process the rest
    for (var i = start+1; i < doc.pages.length; i++)
        {
        var next_frame = place_frame (doc, i, gb, frame_style);
        // place_frame labels frames with the label "column_note"
        next_frame.previousTextFrame = doc.pages[i-1].textFrames.itemByName ("column_note");
        }
    restore_view (doc, view_prefs);
    return first_frame.parentStory;
    }


// Place a frame on page pnum using gb geometricBounds, apply a frame style
// and set each frame's label to "column_note"

function place_frame (doc, pnum, gb, frame_style)
    {
    // "gb" is a two-element array of geometricBounds
    if (parseInt (app.version) > 6)
        var f = doc.pages[pnum].textFrames.add ({geometricBounds: gb[pnum%2], name: "column_note"});
    else
        var f = doc.pages[pnum].textFrames.add ({geometricBounds: gb[pnum%2], label: "column_note"});
    f.applyObjectStyle (frame_style);
    return f
    }

// Get the coordinates of the columns and return an array of two geometricBounds,
// one for the rectos, the other for the versos. Frames are set arbitrarily to a height
// of 80 points

function frame_coordinates (doc, pos)
    {
    var m = doc.pages[0].marginPreferences;
    var bottom_ = doc.documentPreferences.pageHeight - m.bottom;
    // we set the height of the frames to half the vertical measure
    var top_ = (bottom_ - m.top) / 2;
    switch (pos)
        {
        case "right":    // into the right -hand column
            var right_recto = doc.documentPreferences.pageWidth - m.right;
            var right_verso = doc.documentPreferences.pageWidth - m.left;
            var left_recto = right_recto - doc.pages[0].textFrames[0].textFramePreferences.textColumnFixedWidth;
            var left_verso = right_verso - doc.pages[0].textFrames[0].textFramePreferences.textColumnFixedWidth;
            break;
        case "left": // into the left -hand column
            var left_verso = m.right;
            var left_recto = m.left;
            var right_verso = left_verso + doc.pages[0].textFrames[0].textFramePreferences.textColumnFixedWidth;
            var right_recto = left_recto + doc.pages[0].textFrames[0].textFramePreferences.textColumnFixedWidth;
            break;
        case "measure": // full measure
            var right_recto = doc.documentPreferences.pageWidth - m.right;
            var right_verso = doc.documentPreferences.pageWidth - m.left;
            var left_recto = m.left;
            var left_verso = m.right;
            break
        }

    var gb_verso = [top_, left_verso, bottom_, right_verso];
    var gb_recto = [top_, left_recto, bottom_, right_recto];
    return [gb_recto, gb_verso]
    }


// If necessary, create an object style for the footnotes
function add_frame_style (doc, par_style)
    {
    var o_style_name = "column_note";
    if (doc.objectStyles.item (o_style_name) == null)
        {
        with (doc.objectStyles.add ({name: o_style_name}))
            {
            basedOn = doc.objectStyles[0];
            enableParagraphStyle = true;
            appliedParagraphStyle = par_style;
            enableTextWrapAndOthers = true;
            textWrapPreferences.textWrapMode = TextWrapModes.jumpObjectTextWrap;
            textWrapPreferences.textWrapOffset = [6,0,0,0];
            strokeWeight = 0;
            enableTextFrameGeneralOptions = true;
            textFramePreferences.verticalJustification = VerticalJustification.bottomAlign;
            }
        }
    return doc.objectStyles.item (o_style_name)
    }


function set_view (doc)
    {
    var prefs = doc.viewPreferences.properties;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
    doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
    return prefs
    }


function restore_view (doc, prefs)
    {
    doc.viewPreferences.properties = prefs;
    }

//===================================================================================


function numbered_style (pstyle)
    {
    try {pstyle.bulletsAndNumberingListType = ListType.numberedList}
        catch (e) {alert (e.message); exit ()};
    return pstyle;
    }

// If in the footnote options the character style for the cue is set to [None] or (ignore),
// create a characterstyle "footnote_marker____" and copy the marker's position to it.

function find_reference_style (doc)
    {
    if (doc.footnoteOptions.footnoteMarkerStyle == doc.characterStyles[0] || doc.footnoteOptions.footnoteMarkerStyle == null)
        {
        var cs = doc.characterStyles.add ({name: "footnote_marker____"});
        // For the character style, use the position defined in the footnote options
        switch (doc.footnoteOptions.markerPositioning)
            {
            case 1181569904: cs.position = 1936749411; break;
            case 1181576816: cs.position = 1852797549; break;
            case 1181578096: cs.position = 1935831907; break;
            }
        return cs;
        }
    else
        return doc.footnoteOptions.footnoteMarkerStyle;
    }
    


function find_story (doc)
    {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findChangeGrepOptions.includeFootnotes = false;
    app.findGrepPreferences.findWhat = '~F';
    var fn = doc.findGrep ();
    if (fn.length > 0)
        return fn[0].parentStory;
    else
        exit ();
    }


// Delete the note markers in the text and in the notes

function delete_notemarkers (doc)
    {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findChangeGrepOptions.includeFootnotes = true;
    app.findGrepPreferences.findWhat = "~F";
    doc.changeGrep ();
    }


function add_crossref (n, ch_style)
    {
    try
        {
        var cr = app.activeDocument.crossReferenceFormats.add ({name: n});
        cr.appliedCharacterStyle = ch_style;
        cr.buildingBlocks.add (BuildingBlockTypes.paragraphNumberBuildingBlock);
        }
    catch (e) {errorM (e.message)}
    return cr;
    }


function colourise_cues (doc, cs)
    {
    cs.underline = true;
    cs.underlineWeight = 10;
    cs.underlineOffset = -1;
    try {cs.underlineColor = "C=0 M=100 Y=0 K=0"}
        catch (_) {}
    cs.underlineTint = 40;
    }


function set_view (doc)
    {
    var prefs = doc.viewPreferences.properties;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
    doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
    return prefs;
    }


function restore_view (doc, prefs)
    {
    doc.viewPreferences.properties = prefs
    }


function errorM (m)
    {
    alert (m);
    exit ();
    }


function ask_position ()
    {
    var w = new Window ("dialog", "Column notes");
        w.alignChildren = "right";
        var panel = w.add ("panel");
            panel.alignChildren = "left";
            var L = panel.add ("radiobutton", undefined, "\u00a0All notes in left-hand column");
            var M = panel.add ("radiobutton", undefined, "\u00a0All notes on full measure");
            var R = panel.add ("radiobutton", undefined, "\u00a0All notes in right-hand column");
            R.value = true;
        var buttons = w.add ('group');
            buttons.add ('button', undefined, 'OK', {name: 'ok'});
            buttons.add ('button', undefined, 'Cancel', {name: 'cancel'});
    if (w.show () == 1)
        {
        if (L.value == true) return "left";
        if (M.value == true) return "measure";
        if (R.value == true) return "right";
        }
    }