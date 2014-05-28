//DESCRIPTION: convert footnotes to dynamic (cross-referenced) endnotes
// Peter Kahrel -- www.kahrel.plus.com

// June 2010 fix: script now deals all stories with footnotes or a single selected story
// and with footnotes with more than one paragraph.

//Jan 2012: Script now forces the notes to start at 1 and inserts a heading "Notes"

#target indesign;

// Only CS4 and later
if (parseInt (app.version) > 5 && app.documents.length > 0)
    try {foot_to_end (app.documents[0], "endnote___")}
        catch (e) {alert (e.message + " (line " + e.line + ")")};

//-----------------------------------------------------------------------------------------------

function foot_to_end (doc, stylename)
    {
    var endnote, footn, endnote_link, cue;
    var note_styles = add_styles (stylename);
    var stories = find_stories (doc);
	for (var j = 0; j < stories.length; j++)
		{
		if (stories[j].footnotes.length > 0)
			{
			delete_trailing_white (stories[j]);
			stories[j].insertionPoints[-1].contents = '\rNotes';
			footn = stories[j].footnotes;
			for (var i = 0; i < footn.length; i++)
				{
				stories[j].insertionPoints[-1].contents = '\r';
				endnote = footn[i].texts[0].move (LocationOptions.after, stories[j].insertionPoints[-1]);
				endnote.applyParagraphStyle (note_styles.first, false);
				if (i === 0)
					{
					endnote.numberingContinue = false;
					endnote.numberingStartAt = 1;
					}
				if (endnote.paragraphs.length > 1)
					endnote.paragraphs.itemByRange (1,-1).applyParagraphStyle (note_styles.next, false);
				endnote_link = doc.paragraphDestinations.add (endnote.insertionPoints[0]);
				cue = doc.crossReferenceSources.add (footn[i].storyOffset, note_styles.cr_format);
				doc.hyperlinks.add (cue, endnote_link, {visible: false});
				} // for
			delete_notemarkers (stories[j]);
			} //if
		} // for
    doc.crossReferenceSources.everyItem().update();
	}



function find_stories (doc)
	{
	var array = [];
	// no selection: return all stories
	if (app.selection.length == 0)
		return doc.stories.everyItem().getElements();
	else
		try {app.selection[0].parentStory; return [app.selection[0].parentStory]}
			catch (e) {alert ("Invalid selection", "Convert footnotes", true); exit ()}
	}


function delete_trailing_white (scope)
    {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findChangeGrepOptions.includeFootnotes = false;
    app.findGrepPreferences.findWhat = '\\s+\\Z';
    scope.changeGrep ();
    }

function delete_notemarkers (scope)
    {
    app.findGrepPreferences = app.changeGrepPreferences = null;
    app.findChangeGrepOptions.includeFootnotes = true;
    app.findGrepPreferences.findWhat = '~F';
    scope.changeGrep ();
    }


function add_styles (n)
    {
	// Create styles and cross-ref format or return them if they exist
    try
        {
        var char_style = app.activeDocument.characterStyles.add ({name: n});
        char_style.position = Position.superscript;
        }
		catch (_){char_style = app.activeDocument.characterStyles.item (n)};

    try {var p = app.activeDocument.paragraphStyles.add ({name: n + "nonum"})}
		catch (_) {var p = app.activeDocument.paragraphStyles.item (n + "nonum")};

    try
        {
        var par_style = app.activeDocument.paragraphStyles.add ({name: n, basedOn: p});
        par_style.bulletsAndNumberingListType = ListType.numberedList;
        }
		catch (_) {var par_style = app.activeDocument.paragraphStyles.item (n)};

    try
        {
        var cr = app.activeDocument.crossReferenceFormats.add ({name: n});
        cr.appliedCharacterStyle = app.activeDocument.characterStyles.item (n);
        cr.buildingBlocks.add (BuildingBlockTypes.paragraphNumberBuildingBlock);
        }
		catch (_){cr = app.activeDocument.crossReferenceFormats.item (n)}
	return {first: par_style, next: p, cr_format: cr}
    }
