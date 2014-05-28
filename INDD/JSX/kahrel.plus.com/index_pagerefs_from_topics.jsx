//DESCRIPTION: Create page references for existing topics

#target indesign;

if (app.documents.length > 0)
	{
	if (parseInt (app.version) > 5)
		app.doScript ("pagerefs_from_topics ()", undefined, undefined, UndoModes.fastEntireScript);
	else
		pagerefs_from_topics ();
	}

function pagerefs_from_topics ()
	{
	var found_topics;
	var doc_topics = app.documents[0].indexes[0].allTopics;
	pbar____ = progress_bar ("Creating page references");
	for (var i = 0; i < doc_topics.length; i++)
		{
		pbar____.value = i;
		app.findGrepPreferences.findWhat = doc_topics[i].name;
		found_topics = app.documents[0].findGrep (true);
		for (var j = 0; j < found_topics.length; j++)
			try {doc_topics[i].pageReferences.add (found_topics[j], PageReferenceType.currentPage)}
			catch (_){};
		}
	// update the preview
	app.documents[0].indexes[0].update ();
	}


function progress_bar (stop, title)
	{
	w = new Window ('palette', title);
	pb = w.add ('progressbar', undefined, 0, stop);
	pb.preferredSize = [300,20];
	w.show()
	return pb;
	}
