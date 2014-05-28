//DESCRIPTION: Test word division
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;
#targetengine "session";

app.scriptPreferences.enableRedraw = false;
if (parseInt (app.version) > 4)
    try
        {
        if (app.documents.length == 0 || app.selection.length == 0)
            hyphenate_interactive ();
        else
            {
            if (app.selection.length > 0 && app.selection[0].parentStory.constructor.name == "Story")
                hyphenate_wordlist (app.selection[0].parentStory, find_language ());
            else
                {alert ("Select nothing or a text frame."); exit ()}
            }
        }
    catch (e) {alert (e.message + " (at line " + e.line + ")")};



function hyphenate_interactive ()
	{
	var w = Window.find ('palette', 'Word division');
	if (w === null)
		w = hyphenate_dialog();
	w.show ()
	}


function hyphenate_dialog ()
    {
    var w = new Window ("palette {text: 'Word division', alignChildren: 'right'}");
    var g1 = w.add ("group");
        g1.add ("statictext", undefined, "Word to hyphenate:");
        var hyphenate = g1.add ("edittext {active: true}");
        hyphenate.minimumSize.width = 300;
    var g2 = w.add ("group");
        g2.add ("statictext", undefined, "Hyphenated:");
        var hyphenated = g2.add ("edittext");
        hyphenated.minimumSize.width = 300;
    var g3 = w.add ("group");
        g3.add ("statictext", undefined, "Language:");
        var languages = g3.add ("dropdownlist", undefined, app.languagesWithVendors.everyItem().name.sort());
        languages.preferredSize.width = 300;
        var current_language = find_language ();
        languages.selection = languages.find (current_language).index;

    hyphenate.onChange = function () {hyphenated.text = hyphenate_word (hyphenate.text, languages.selection.text)};
    languages.onChange = function () {hyphenated.text = hyphenate_word (hyphenate.text, languages.selection.text)};
	return w;
    }


function hyphenate_word (word, lg)
    {
    var d = app.documents.add (false);
    var tf = add_frame (d, lg);
    var hword = hyphenate (tf, word);
    d.close (SaveOptions.no);
    return (hword)
    }


function hyphenate_wordlist (story, lg)
    {
    app.scriptPreferences.enableRedraw = false;
    var temp_frame = add_frame (app.documents[0], lg);
    var words = story.words.everyItem().getElements();
    var re = /-/g;
    for (var i = words.length-1; i > -1; i--)
        words[i].contents = hyphenate (temp_frame, words[i].contents.replace (re, ""));
    temp_frame.remove ();
    alert ("Used " + lg);
    }


function hyphenate (frame, word)
    {
    frame.contents = word;
    var gb = [50, 50, 200, 60];
    frame.geometricBounds = gb;
    while (frame.overflows)
        {
        gb[3]++;
        frame.geometricBounds = gb
        }
	var bit = frame.lines[0].contents;
	var parts = [bit];
	while (frame.lines.length > 1)
		{
		gb[3]++;
		frame.geometricBounds = gb;
		if (frame.lines[0].contents.length !== bit.length)
			{
			parts.push(frame.lines[0].contents.slice(bit.length));
			bit = frame.lines[0].contents;
			}
		}
//~ 	$.writeln (parts.join("-"))
	return parts.join("-");
//~     return frame.lines.everyItem().contents.join ("-")
    }


function add_frame (doc, language)
    {
    doc.viewPreferences.horizontalMeasurementUnits = doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
    var tf = doc.textFrames.add ();
    tf.parentStory.appliedLanguage = language;
    tf.texts[0].hyphenation = true;
    var gb = [50, 50, 200, 60];
    tf.geometricBounds = gb;
    return tf
    }


// Find the applied language: if there's a selection, return the language of the applied paragraph style; otherwise if there's a document,
// return the language of the default paragraph style; if that doesn't work, return the language of the application's default paragraph style.

function find_language ()
    {
    try {var lg = app.selection[0].appliedParagraphStyle.appliedLanguage.name}
    catch (_)
        {
        try {var lg = app.selection[0].parentStory.appliedLanguage.name}
        catch (_)
            {
            try {var lg = app.documents[0].textDefaults.appliedParagraphStyle.appliedLanguage.name}
            catch (_) {var lg = app.textDefaults.appliedParagraphStyle.appliedLanguage.name}
            }
        }
    return lg
    }