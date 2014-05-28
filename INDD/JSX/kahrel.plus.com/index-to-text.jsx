
#target indesign

mess = create_message (30, 'Show index');
index2text (app.activeDocument);
//mark_entries (app.activeDocument);


function index2text (doc)
	{
	var doc_topics = doc.indexes[0].allTopics;
	for (var i = 0; i < doc_topics.length; i++)
		{
		mess.text = doc_topics[i].name;
		for (var j = doc_topics[i].pageReferences.length-1; j > -1; j--)
			doc_topics[i].pageReferences[j].sourceText.contents = 
				'<ix>' + topic_path (doc_topics[i], doc_topics[i].name) + '</ix>';
		}
	// delete page references and topics
	doc.indexes[0].topics.everyItem().pageReferences.everyItem().remove();
	doc.indexes[0].topics.everyItem().remove();
	}


// Create topic string. Subtopics are separated by '#'
function topic_path (top, str)
	{
	if (top.parent.constructor.name == 'Index')
		return str;
	else
		return topic_path (top.parent, top.parent.name + '#' + str)
	}


function mark_entries (doc)
	{
	mess.text = 'Marking entries...';
	var colour = check_colour ('index');
	if (doc.characterStyles.item ('temp_index___') == null)
		doc.characterStyles.add ({name: 'temp_index___', fillColor: colour});
	app.findGrepPreferences = app.changeGrepPreferences = null;
	app.findGrepPreferences.findWhat = '<ix>.+?</ix>';
	app.changeGrepPreferences.appliedCharacterStyle = 
		doc.characterStyles.item ('temp_index___');
	doc.changeGrep();

	function check_colour (n)
		{
		if (app.activeDocument.swatches.item (n) == null)
			app.activeDocument.colors.add ({name: n, space: ColorSpace.cmyk, colorValue: [100,0,0,0]});
		return app.activeDocument.swatches.item (n)
		}
	}

function create_message (le, title)
	{
	dlg = new Window('palette', title);
	dlg.alignChildren = ['left', 'top'];
	var txt = dlg.add('statictext', undefined, '');
	txt.characters = le;
	dlg.show();
	return txt
	}

