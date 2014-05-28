// Display GREP queries
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;
#targetengine "session";

if (parseInt (app.version) > 5)
    {
    try {show_grep_queries ()}
        catch (e) {alert (e.message + "\r(line " + e.line + ")")};
    }


function show_grep_queries ()
    {
    var xml, find_what, change_to, f;
    var w = new Window ("palette", "GREP queries at a glance", undefined, {resizeable: true});
    var maxwidth = $.screens[0].right-100;
    var maxheight = $.screens[0].bottom-100;
    w.maximumSize.width = maxwidth;
    w.maximumSize.height = maxheight;
    w.orientation = "row";
    w.alignChildren = ["top", "top"];
        var list = w.add ("listbox", undefined, undefined, 
                {numberOfColumns: 3, showHeaders: true, 
                    columnTitles: ["Query", "Find what", "Change to"], multiselect: true,
                    columnWidths: [200, 500, 150]});
            list.maximumSize.height = maxheight-50;
            list.maximumSize.width = maxwidth-300;
        var buttons = w.add ("group");
            buttons.orientation = "column";
            buttons.alignChildren = "fill";
            var copy_b = buttons.add ("button", undefined, "Query to F/C dialog");
            var gr_style = buttons.add ("button", undefined, "Query to GREP style");
            var delete_b = buttons.add ("button", undefined, "Delete selected query");
            var exit_b = buttons.add ("button", undefined, "Close", {name: "ok"});
    var default_font = ScriptUI.applicationFonts.palette.name+":16.0";
    set_font (w);
    if (app.documents.length == 0)
        gr_style.enabled = false;

    var query_folder = app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/Grep/";
    var queries = Folder (query_folder).getFiles ("*.xml");
    var findstring = {}
    for (var i = 0; i < queries.length; i++)
        {
        queries[i].open ("r");
        xml = new XML (queries[i].read ());
        queries[i].close ();
        var qname = decodeURI (queries[i].name).replace (/\.xml$/, "");
        find_what = String (xml.Description.FindExpression.@value);
        findstring [qname] = find_what;
        change_to = xml.Description.ReplaceExpression.@value;
        with (list.add ("item", qname))
            {
//~             subItems[0].text = ((find_what == "") ? "----" : displayed (find_what));
            subItems[0].text = ((find_what == "") ? "----" : find_what);
            subItems[1].text = ((change_to == "") ? "----" : change_to);
            }
        }
    
    list.selection = 0;
    
    list.addEventListener ("mousedown", function (k) {show_pretty (k)});
	
	function show_pretty (k)
		{
		if (k.button == 2)  // if right-button pressed
			{
            var literal = findstring [list.selection[0].text];
            var w1 = new Window ("dialog", list.selection[0].text);
                w1.alignChildren = "right";
                var displ = w1.add ("edittext", undefined, prettied (literal), {multiline: true});
                    displ.graphics.font = default_font
                    displ.minimumSize.width = 500;
                    displ.minimumSize.height = 200;
                var w1_buttons = w1.add ("group");
                    var copy_expr = w1_buttons.add ("button", undefined, "Load", {name: "ok"});
                    w1_buttons.add ("button", undefined, "Close", {name: "cancel"});
            set_font (w1);
            if (w1.show () == 1)
                {
                w1.close ();
                w.close (1);
//~                 return literal;
                app.loadFindChangeQuery (list.selection[0].text, SearchModes.grepSearch);
                }
			}
		}
    
    
    function prettied (s)
        {
        s = s.replace (/\(\?#\)/g, "\r");
        return s.replace (/\(\?#T\)/g, "    ");
        }


//~     function displayed (s)
//~         {
//~         s = s.replace (/\(\?#\)\s*/g, "");
//~         var le = s.length;
//~         if (le > 50)
//~             s = s.slice (0,50) + " . . ."; // clip expressions to the first 50 characters
//~         return s;
//~         }


    delete_b.onClick = function ()
        {
        if (list.selection.length == 1)
            var s = "Delete selected query?";
        else
            var s = "Delete selected queries?";
        if (ask_yn (s))
            {
            var le = list.selection.length;
            var first = list.selection[0].index;
            // delete the queries on disk
            for (var i = 0; i < le; i++)
                File (query_folder + list.selection[i].text +".xml").remove ();
            // delete items from the list
            if (le == 1)
                list.remove (list.selection[0]);
            else
                {
                var array = list.selection.reverse();
                for (var i = 0; i < le; i++)
                    list.remove (array[i]);
                }
            if (list.items.length > 0)
                list.selection = first;
            }
        }

    list.onChange = function ()   // single-click in the list
        {
        copy_b.enabled = list.selection.length == 1;
        gr_style.enabled = app.documents.length > 0;
        if (list.selection.length == 1)
            delete_b.text = "Delete selected query";
        else
            delete_b.text = "Delete selected queries";
        }
    
    copy_b.onClick = copy_to_FC;
    list.onDoubleClick = copy_to_FC;  // can't get notify() to work here

    function copy_to_FC ()
        {
        app.loadFindChangeQuery (list.selection[0].text, SearchModes.grepSearch);
        w.close ();
        }
    
    
    if (parseInt (app.version) > 5)
        {
        gr_style.onClick = function ()
            {
            var psnames = app.documents[0].paragraphStyles.everyItem().name;
            psnames.shift();
            var w1 = new Window ("dialog");
                var main = w1.add ("group");
                    main.alignChildren = "fill";
                    main.orientation = "column";
                    main.add ("statictext", undefined,  "Select paragraph style(s):");
                    var pstyles = main.add ("listbox", undefined, psnames, {multiselect: true});
                    pstyles.minimumSize.width = 300;
                    pstyles.minimumSize.height = 200;
                    var buttons = main.add ("group");
                        buttons.alignment = "right"
                        var ok = buttons.add ("button", undefined, "OK", {name: "ok"});
                        buttons.add ("button", undefined, "Cancel", {name: "cancel"});
                        ok.enabled = false;
                    set_font (main);
                pstyles.onChange = function () {ok.enabled = pstyles.selection != null}

            if (w1.show () == 1)
                {
                var i, j, gr;
                for (var j = 0; j < list.selection.length; j++)
                    {
                    var gr = findstring [list.selection[j].text];
                    for (i = 0; i < pstyles.selection.length; i++)
                        app.documents[0].paragraphStyles.item (pstyles.selection[i].text).nestedGrepStyles.add ({grepExpression: gr})
                    }
                }
            w1.close ();
            }
        }
    
    function set_font (control)
        {
        for (var i = 0; i < control.children.length; i++)
            {
            if ("GroupPanel".indexOf (control.children[i].constructor.name) > -1)
                set_font (control.children[i]);
            else
                control.children[i].graphics.font = default_font;
            }
        }
    
    exit_b.onClick = function () {w.close ()};
    w.show ();
    } // show_grep_queries


function readable (s)
    {
    s = s.replace (/&lt;/g, "<");
    s = s.replace (/&gt;/g, ">");
    s = s.replace (/&apos;/g, "'");
    s = s.replace (/&quot;/g, '"');
    s = s.replace (/\(\?#\)/g, "\r");
    return s
    }


function ask_yn (s)
    {
    var w = new Window ("dialog", "Delete queries");
        var t = w.add ("group");
            t.add ("statictext", undefined, s);
        var b = w.add ("group");
            b.add ("button", undefined, "Yes", {name: "ok"});
            b.add ("button", undefined, "No", {name: "cancel"});
    var temp = w.show ();
    w.close ();
    return temp == 1;
    }
