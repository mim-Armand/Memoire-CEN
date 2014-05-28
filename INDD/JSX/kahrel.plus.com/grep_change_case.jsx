#target indesign;
#targetengine "change_case";


var change_case_palette = create_palette();
change_case_palette.show();


function create_palette ()
	{
	var w = Window.find ("palette", "Change case");
	if (w === null)
		return create_palette_sub ();
	return w;
	}


function create_palette_sub ()
	{
	var w = new Window ("palette", "Change case", undefined, {resizeable: true});
		var options = [ChangecaseMode.lowercase, ChangecaseMode.uppercase];
		w.alignChildren = "fill";
		var rb = w.add ("panel");
			var upper_to_lower = rb.add ("radiobutton", undefined, " A > a\u00A0");
			var lower_to_upper = rb.add ("radiobutton", undefined, " a > A\u00A0");
		var smallcaps = w.add ("checkbox", undefined, " Apply SC");
		var b = w.add ("group {orientation: 'column', alignChildren: 'fill'}");
			
			var find_group = b.add ('group {orientation: "stack", alignChildren: "fill"}')
				if (File.fs === "Windows")
					{
					var find = find_group.add ("button", undefined, "Find");
					var find_next = find_group.add ("button", undefined, "Find next");
					}
				else
					{
					var find_next = find_group.add ("button", undefined, "Find next");
					var find = find_group.add ("button", undefined, "Find");
					}			
			
			var change = b.add ("button", undefined, "Change");
			var change_all = b.add ("button", undefined, "Change all");
			var change_find = b.add ("button", undefined, "Change/find");


		if (app.findGrepPreferences.findWhat.indexOf ("\\u") > -1)
			{
			upper_to_lower.value = true;
			changetype = ChangecaseMode.lowercase;
			}
		else
			{
			lower_to_upper.value = true;
			changetype = ChangecaseMode.uppercase;
			}

		upper_to_lower.onClick = function () {changetype = ChangecaseMode.lowercase};
		lower_to_upper.onClick = function () {changetype = ChangecaseMode.uppercase};

		var found, found_counter;

		find.onClick = function ()
			{
			found = app.documents[0].findGrep();
			if (found.length > 0)
				{
				found_counter = 0; find.hide();
				find_next.show();
				show_found (found[found_counter]);
				}
			else
				alert ("No (more) matches found.");
			}

		find_next.onClick = function ()
			{
			found_counter++;
			if (found_counter < found.length)
				show_found (found[found_counter]);
			else
				{
				find_next.hide(); find.show();
				alert ("No (more) matches found.");
				}
			}
		
		change.onClick = function () {
			found[found_counter].changecase(changetype);
			if (smallcaps.value == true) {found[found_counter].capitalization = Capitalization.smallCaps;}
			}
		
		change_find.onClick = function ()
			{
			if (found_counter < found.length)
				{
				found[found_counter].changecase(changetype);
				if (smallcaps.value == true) {found[found_counter].capitalization = Capitalization.smallCaps;}
				found_counter++;
				if (found_counter < found.length)
					show_found (found[found_counter]);
				else
					alert ("No (more) matches found.");
				}
			}
		
		change_all.onClick = function ()
			{
			for (var i = found_counter; i < found.length; i++)
				{
				found[i].changecase(changetype);
				if (smallcaps.value == true)
					found[i].capitalization = Capitalization.smallCaps;
				}
			}
		
		w.onDeactivate = function () {find.show(); find_next.hide()}
		w.onActivate = function () {find.show(); find_next.hide()}
		
	return w;
	} // create_palette_sub



function show_found (f)
    {
    f.select();
    app.activeWindow.activePage = find_page (f.parentTextFrames[0]);
    }


function find_page (o)
    {
    try
        {
        if (o.hasOwnProperty ("parentPage"))
            return o.parentPage;
        if (o.constructor.name == "Page")
            return o;
        switch (o.parent.constructor.name)
            {
            case "Character": return find_page (o.parent);
            case "Cell": return find_page (o.parent.texts[0].parentTextFrames[0]);
            case "Table" : return find_page (o.parent);
            case "TextFrame" : return find_page (o.parent);
            case "Group" : return find_page (o.parent);
            case "Story": return find_page (o.parentTextFrames[0]);
            case "Footnote": return find_page (o.parent.storyOffset);
            case "Page" : return o.parent;
            }
        }
        catch (_) {return ""}
    }
