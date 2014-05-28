//DESCRIPTION: Highlight deviations in word and letter spacing
//Peter Kahrel -- www.kahrel.plus.com

#target indesign;

if (parseInt (app.version) > 5 && app.documents.length > 0)
	highlight_spacing (app.documents[0], [225,225,255], [200,255,200]);

function highlight_spacing (doc, W_colour, L_colour)
	{
	var w_spacing = add_condition (doc, 'w_spacing', W_colour);
	var l_spacing = add_condition (doc, 'l_spacing', L_colour);
	var p = doc.stories.everyItem().paragraphs.everyItem().getElements();
	for (var i = 0; i < p.length; i++)
		{
		p[i].applyConditions ([], true);
		if (current_spacing ('w', p[i]) != style_spacing ('w', p[i].appliedParagraphStyle))
			p[i].applyConditions (w_spacing);
		if (current_spacing ('l', p[i]) != style_spacing ('l', p[i].appliedParagraphStyle))
			p[i].applyConditions (l_spacing);
		}
	// Conditional text is visible only Normal screenmode
	app.documents[0].layoutWindows[0].screenMode = ScreenModeOptions.previewOff;
	}


function current_spacing (x, par)
	{
	switch (x)
		{
		case 'w' : return String (par.minimumWordSpacing) +
			String (par.desiredWordSpacing) /*+ String (par.maximumWordSpacing)*/;
		case 'l' : return String (par.minimumLetterSpacing) +
			String (par.desiredLetterSpacing) /*+ String (par.maximumLetterSpacing)*/;
		}
	}


function style_spacing (x, par_style)
	{
	return current_spacing (x, par_style)
	}


function add_condition (doc, n, c)
	{
	if (doc.conditions.item (n) == null)
		doc.conditions.add ({
				name: n, 
				indicatorColor: c, 
				indicatorMethod: ConditionIndicatorMethod.useHighlight});
	return doc.conditions.item (n)
	}