//DESCRIPTION: Collect GREP results
//Peter Kahrel -- www.kahrel.plus.com

#target indesign;

if (parseInt (app.version) > 4 && app.documents.length > 0)
    chain_queries ();

function chain_queries ()
    {
    $.localize = true;  // This is pointless in scriptUI dialogs
    var f;
    var array = [];
    var locale_strings = define_strings ();
    // returns four-element object: the selected queries, the search scope, test_only value, and include_attrib
    var obj = select_queries (locale_strings);
    // return a manageable string
    var search = find_domain (obj.scope);
    message_txt = create_message (30, "Running queries");
    // If attributes should be included, add a doc and return a text frame ("output")
    if (obj.test == true && obj.include_attrib == true)
        var output = create_output (app.documents[0].name);
    for (var i = 0; i < obj.selected_queries.length; i++)
        {
        message_txt.text = obj.selected_queries[i];
        app.loadFindChangeQuery (obj.selected_queries[i], SearchModes.grepSearch);
        if (search instanceof Array)
            for (var j = 0; j < search.length; j++)
                {
                if (obj.test == true)
                    {
                    f = search[j].parentStory.findGrep ()
                    array = add_found (array, f, obj.include_attrib, output)
                    }
                else
                    search[j].parentStory.changeGrep ()
                }
        else
            {
            if (obj.test == true)
                array = add_found (array, eval (search + ".findGrep ()"), obj.include_attrib, output);
            else
                eval (search + ".changeGrep ()")
            }
        }
    if (obj.test == true)
        {
        if (obj.include_attrib == false)
            {
            message_txt.text = localize (locale_strings.dlg_writing);
            write_found (array);
            }
        else
            app.activeWindow = output.parent.parent.parent.layoutWindows[0];
        }
    message_txt.parent.close ();
    }


function add_found (array, found, attr, text_frame)
    {
    if (attr == false)
        {
        for (var i = 0; i < found.length; i++)
            array.push (found[i].contents);
        return array
        }
    else
        for (var i = 0; i < found.length; i++)
            {
            found[i].duplicate (LocationOptions.after, text_frame.insertionPoints[-1]);
            text_frame.insertionPoints[-1].contents = "\r"
            }
    }


function write_found (array)
    {
    var s = array.sort().join("\r")+"\r";
    s = s.replace (/([^\r]+\r)(\1)+/g,"$1");
    s = s.replace (/\r$/,"");
    flow (s, 2)
    }


function flow (s, col)
    {
    var doc = app.documents.add();
    doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
    var marg = doc.pages[0].marginPreferences;
    var gb = [marg.top, marg.left, 
        app.documentPreferences.pageHeight - marg.bottom, 
        app.documentPreferences.pageWidth - marg.right];
    doc.textFrames.add ({geometricBounds: gb, contents: s, textFramePreferences: {textColumnCount: col}});
    while (doc.pages[-1].textFrames[0].overflows)
        {
        doc.pages.add().textFrames.add ({geometricBounds: gb, textFramePreferences: {textColumnCount: col}});
        doc.pages[-1].textFrames[0].previousTextFrame = doc.pages[-2].textFrames[0];
        }
    }



function create_output (n)
    {
    var newdoc = app.documents.add ();
    newdoc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
    var marg = newdoc.pages[0].marginPreferences;
    var gb = [marg.top, marg.left, 
    app.documentPreferences.pageHeight - marg.bottom, 
    app.documentPreferences.pageWidth - marg.right];
    var f = newdoc.textFrames.add ({geometricBounds: gb, textFramePreferences: {textColumnCount: 2}});
    app.activeWindow = app.documents.item (n).layoutWindows[0];
    return f
    }


function find_domain (s)
    {
    switch (s)
        {
        case "Document" : 
        case "Dokument" : 
            return "app.documents[0]";
        case "All documents": 
        case "Tous les documents": 
        case "Alle dokumente": 
            return "app";
        case "Story": 
        case "Article": 
        case "Textabschnitt": 
            return "app.selection[0].parentStory";
        case "Stories": 
        case "Articles": 
        case "Textabschnitte": 
            return app.selection; // can't return a string for eval: we have two or more text frames
//~         case "To end of story": 
//~         case "Jusqu'à la fin de l'article": 
//~         case "Zum Ende des Textabschnitts": 
//~             return "app.selection[0].parentStory.insertionPoints.itemByRange (app.selection[0], app.selection[0].parentStory.insertionPoints[-1])";
        case "Selection": 
        case "Sélection": 
        case "Auswahl": 
            return "app.selection[0]";
        }
    }


// Interface =========================================================================================================

function select_queries (loc)
    {
    var scriptfolder = script_dir ();
//~     var history_file = app.scriptPreferences.scriptsFolder + "/chain_queries_history.txt";
    var history_file = scriptfolder + "/chain_queries_history.txt";
    var query_folder = Folder (app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/Grep/");
    // get the user's stored queries
    var queries = find_queries (query_folder);
    // get the user's previous selection
    var previous = previous_run (history_file);
    // get a list of searchg domains (document, all documents, etc.)
    var search_list = get_list (loc);
    
    var w = new Window ("dialog", localize (loc.dlg_title), undefined, {resizeable: true});
        var main_ = w.add ("panel");
            main_.alignChildren = "fill";
            w.alignment = "right";
        var chain_ = main_.add ("group");
            chain_.add ("statictext", undefined, localize (loc.dlg_chain));
            var saved_chains = chain_.add ("dropdownlist"); //, undefined, chain_queries);
            saved_chains.minimumSize.width = 190;
            saved_chains.selection = 1;
            try {var save_button = chain_.add ("iconbutton", [0,0,18,22], File (scriptfolder + "/button_icon_save.png"))}
                catch (_) {save_button = chain_.add ("button", [0,0,18,22], "S")};
            try {var delete_button = chain_.add ("iconbutton", [0,0,18,22], File (scriptfolder + "/button_icon_bin.png"))}
                catch (_) {save_button = chain_.add ("button", [0,0,18,22], "D")};
        var list = main_.add ("listbox", undefined, queries, {multiselect: true});
            list.minimumSize.height = 100;
            list.maximumSize.height = w.maximumSize.height - 350;
        var scope = main_.add ("group");
            scope.add ("statictext", undefined, localize (loc.dlg_search));
            var search_domain = scope.add ("dropdownlist", undefined, search_list.list);
                search_domain.selection = search_list.preselect;
                search_domain.minimumSize.width = 160;
        var test_chain = main_.add ("group");
            var test = test_chain.add ("checkbox", undefined, localize (loc.dlg_test_only));
            test.value = true;
        var incl_format = test_chain.add ("checkbox", undefined, localize (loc.dlg_include_format));
        var buttons = w.add ("group");
            buttons.alignment = "right";
            buttons.add ("button", undefined, "OK", {name: "ok"});
            buttons.add ("button", undefined, localize (loc.dlg_cancel), {name: "cancel"});


    // Create and display the stored chain queries
    // "" means that there's no item to be selected
    
    find_chains (query_folder, "");


    function find_chains (user_folder, select_item)
        {
        try {saved_chains.removeAll ()} catch (_){};
        saved_chains.add ("item", localize (loc.dlg_custom));
        var f = user_folder.getFiles ("*.grpq");
        for (var i = 0; i < f.length; i++)
            saved_chains.add ("item", decodeURI (f[i].name).replace (/\.grpq$/, ""));
        // if "select_item" has some contents, then select it in its list
        if (select_item != "")
            for (var i = 0; i < saved_chains.items.length; i++)
                if (saved_chains.items[i].text == select_item)
                    {
                    saved_chains.items[i].selected = true;
                    break
                    }
        }
    
    // When the dialog is first displayed, restore the last selection
    // (this one could be done better)
    // We'll do it in a try/catch to make the script "compatible" with old history files
    if (previous.length > 0)
        {
        try
            {
            // the history file contains one line of the form
            // chainquery£|query1|query2|query3|
            var previous_chain = previous.split ("£")[0];
            // select the last used goup
            for (var i = 0; i < saved_chains.items.length; i++)
                if (saved_chains.items[i].text == previous_chain)
                    {
                    saved_chains.items[i].selected = true;
                    break;
                    }
            // The history files specifies a chain but the chain file no longer exists
            // Select the [Custom] chain name, which is always present
            if (saved_chains.selection == null)
                saved_chains.items[0].selected = true;
            var previous_selection = previous.split ("£")[1];
            // select all queries in the chain
            var array = [];
            for (var i = 0; i < queries.length; i++)
               if (previous_selection.search ("|" + queries[i] + "|") > -1)
                   array.push (list.items[i]);
            list.selection = array;
            }
        catch (_) {}
        }
    else
        saved_chains.items[0].selected = true;
    // If there's no selection in the query dropdown, disable the Save button
    save_button.enabled = list.selection != null;
    if (saved_chains.selection.index == 0 || saved_chains.items.length == 1)
        delete_button.enabled = list.selection != null;

    // chain query picked: mark its contents in the query list
    saved_chains.onChange = function ()
        {
        var current = saved_chains.selection.index;
        var f = File (query_folder + "/" + saved_chains.selection.text + ".grpq");
        f.open ("r");
        var temp = f.read ();
        f.close ();
        list.selection = null;
        var array = [];
        for (var i = 0; i < queries.length; i++)
            if (temp.search ("|" + queries[i] + "|") > -1)
                array.push (list.items[i]);
        list.selection = array;
        // generalise this one
        if (saved_chains.selection.index == 0 || saved_chains.items.length == 1)
            delete_button.enabled = false;
        else
            delete_button.enabled = true;
        }

    list.onChange = function () {save_button.enabled = list.selection != null; /*saved_chains.items[0].selected = true*/}
    
    list.onDoubleClick = function ()
        {
        show_grep (list.selection)
        }
    
    // Return an array of selected queries
    function get_selected_queries (listbox)
        {
        var array = listbox.selection;
        for (var i = 0; i < array.length; i++)
            array[i] = array[i].text;
        return array
        }

    test.onClick = function ()
        {
        if (this.value == true)
            incl_format.enabled = true;
        else
            {
            incl_format.value = false;
            incl_format.enabled = false
            }
        }

    save_button.onClick = function ()
        {
        array = get_selected_queries (list);
        var temp = saved_chains.selection.index;
        new_chain = save_chain (query_folder, array, loc);
        // Refresh the list in the dialog
        find_chains (query_folder, new_chain);
        if (saved_chains.selection == null)
            saved_chains.items[temp].selected = true;
        }
    
    delete_button.onClick = function ()
        {
        if (ask_yn (localize (loc.dlg_confirm_delete, "\""+saved_chains.selection.text + "\"?"), loc))
            {
            try
                {
                File (query_folder + "/" + saved_chains.selection.text + ".grpq").remove ();
                list.selection = null;
                saved_chains.remove (saved_chains.selection.index);
                saved_chains.items[0].selected = true;
                saved_chains.active = true;
                }
            catch (e) {alert ("Problem deleting " + '"' + saved_chains.selection.text + '": ' + e.message); exit ()}
            }
        }


    if (w.show () == 1)
        {
        var array = get_selected_queries (list);
        // This should not be necessary, but apparently it is
        // To be fixed.
        if (saved_chains.selection == null)
            var qsave = localize (loc.dlg_custom);
        else
            var qsave = saved_chains.selection.text;
        save_run (history_file, qsave, array);
        return {selected_queries: array, scope: search_domain.selection.text, test: test.value, include_attrib: incl_format.value} 
        }
    else
        exit()
    }



function find_queries (user_folder)
    {
    var user_queries = user_folder.getFiles ("*.xml");
    
    if (parseInt (app.version) == 5) // folder in CS3
        var app_folder = Folder (app.filePath + "/Presets/Find-Change Queries/Grep/");
    else // folder in CS4 and higher
        var app_folder = Folder (app.filePath + "/Presets/Find-Change Queries/Grep/" + $.locale + "/");
    var app_queries = app_folder.getFiles ("*.xml");
    
    var array = user_queries.concat (app_queries);
    for (var i = 0; i < array.length; i++)
        array[i] = decodeURI (array[i].name).replace (/\.xml$/, "");
    return array
    }



function get_list (o)
    {
    var list = [localize (o.dlg_all_documents), localize (o.dlg_document)];
    var preselect = 1;
    if (app.selection.length > 0)
        {
        if (app.selection.length > 1 && app.selection[0] instanceof TextFrame)
            {
            list.push (localize (o.dlg_stories));
            return {preselect: 2, list: list}
            }
        if (app.selection.length ==1 && app.selection[0] instanceof TextFrame)
            {
            list.push (localize (o.dlg_story));
            return {preselect: 2, list: list}
            }
        if (app.selection[0] instanceof InsertionPoint)
            {
            // "to_end_of_story doesn't work
            list = list.concat ([localize (o.dlg_story) /*, localize (o.dlg_to_end_of_story)*/ ]);
            return {preselect: 2, list: list}
            }
        if ("TextWordParagraph".search (app.selection[0].constructor.name) > -1)
            {
            list = list.concat ([localize (o.dlg_story), localize (o.dlg_selection)]);
            return {preselect: 3, list: list}
            }
        }
    return {preselect: preselect, list: list}
    }


function previous_run (s)
    {
    var f = File (s);
    if (f.exists)
        {
        f.open ("r");
        var temp = f.read ();
        f.close ();
        return temp;
        }
    else
        return ""
    }


function save_run (s, chain_name, array)
    {
    var f = File (s);
    f.open ("w");
    f.write (chain_name + "£|" + array.join ("|") + "|");
    f.close ();
    }


//============================================================================================

function save_chain (dir, array, loc)
    {
    var string_to_save = "|" + array.join ("|") + "|";
    var saved_queries = [];
    var temp = Folder (dir).getFiles ("*.grpq");
    for (var i = 0; i < temp.length; i++)
        saved_queries.push (decodeURI (temp[i].name.replace (/\.grpq$/, "")));
    var w = new Window ("dialog", localize (loc.dlg_save_chain));
        w.alignChildren = "right";
        var g = w.add ("panel");
            g.alignChildren = "right";
            var g1 = g.add ("group");
                var prompt = g1.add ("statictext", undefined, localize (loc.dlg_name));
                var input_ = g1.add ("edittext", [0,0,180,22], localize (loc.dlg_standard));
            var g2 = g.add ("group");
                g2.add ("statictext", undefined, localize (loc.dlg_chains));
                var list = g2.add ("dropdownlist", [0,0,180,22], saved_queries);
            
    var b = w.add ("group");
        b.add ("button", undefined, "OK", {name: "OK"});
        b.add ("button", undefined, localize (loc.dlg_cancel), {name: "cancel"});
        
    input_.active = true;
    list.selection = 0;
    
    input_.onChange = function () {select_item (input_.text, list)}
    
    list.onChange = function ()
        {
        input_.text = list.selection.text;
        input_.active = true;
        }
    
    if (w.show () == 1)
        {
        var res = save_chain_query (dir, input_.text, string_to_save, loc);
        if (res.length == 0)
            save_chain (dir, array, loc);
        return res;
        }
    }


function select_item (str, obj)
    {
    for (var i = 0; i < obj.items.length; i++)
        if (obj.items[i].text == str)
            {
            obj.items[i].selected = true;
            break
            }
    }

function save_chain_query (dir, fstring, string_to_save, loc)
    {
    if (fstring.search (/\.grpq$/) < 0)
        fstring += ".grpq";
    var f = File (dir + "/" + fstring);
    if (f.exists == false || ask_yn ('"' + fstring.replace (/\.grpq$/, "") + localize (loc.dlg_exists_replace), loc))
        {
        f.open ("w");
        f.write (string_to_save);
        f.close ();
        return fstring.replace (/\.grpq$/, "");
        }
    else
        return ""
    }


function ask_yn (s, loc)
    {
    var w = new Window ("dialog", "!");
        var t = w.add ("group");
            t.add ("statictext", undefined, s);
        var b = w.add ("group");
            b.add ("button", undefined, localize (loc.dlg_yes), {name: "ok"});
            b.add ("button", undefined, localize (loc.dlg_no), {name: "cancel"});
    var temp = w.show ();
    w.close ();
    return temp == 1;
    }

//============================================================================================

function create_message (le, title)
    {
    message_dlg = new Window ("palette", title);
    message_dlg.alignChildren = ["left", "top"];
    var message_txt = message_dlg.add ("statictext", undefined, "");
    message_txt.characters = le;
    message_dlg.show();
    return message_txt;
    }


function script_dir ()
    {
    try {return File (app.activeScript).path}
    catch (e) {return File(e.fileName).path}
    }

//============================================================================================

function define_strings ()
    {
    return {
        dlg_title: {en: "Chain GREP queries", fr: "Enchaîner requêtes GREP", de: "GREP Abfragen ketten"},
        dlg_chain: {en: "Chain:", fr: "Chaîne:", de: "Kette:"},
        dlg_chains: {en: "Chains:", fr: "Chaînes:", de: "Kette:"},
        dlg_search: {en: "Search:", fr: "Chercher dans:", de: "Suchen:"},
        dlg_cancel: {en: "Cancel", fr: "Annuler", de: "Abbrechen"},
        dlg_document: {en: "Document", fr: "Document", de: "Dokument"},
        dlg_all_documents: {en: "All documents", fr: "Tous les documents", de: "Alle Dokumente"},
        dlg_story: {en: "Story", fr: "Article", de: "Textabschnitt"},
        dlg_stories: {en: "Stories", fr: "Articles", de: "Textabschnitte"},
        dlg_to_end_of_story: {en: "To end of story", fr: "Jusqu'à la fin de l'article", de:"Zum Ende des Textabschnitts"},
        dlg_selection: {en: "Selection", fr: "Sélection", de: "Auswahl"},
        dlg_writing: {en: "Writing...", fr: "Écrire...", de: "Schreiben..."},
        dlg_include_format: {en: " Include formatting\u00A0", fr: " Conserver la mise en forme\u00A0", de: " Einschliesslich Formatierung\u00A0"},
        dlg_test_only: {en: " Test only\u00A0", fr: " Seulement évaluer\u00A0", de: " Nur testen\u00A0"},
        dlg_save: {en: "Save", fr: "Enregistrer", de: "Speichern"},
        dlg_confirm_delete: {en: "Delete %1", fr: "Supprimer %1", de: "%1 l\u00F6schen"},
        dlg_replace: {en: "Replace", fr: "Remplacer", de: "Ersetzen"},
        dlg_exists: {en: "exists", fr: "existe", de: "existiert"},
        dlg_exists_replace: {en: "\" exists. Replace?", fr: "\" existe. Remplacer?", de: "\" existiert. Ersetzen?"},
        dlg_exists_delete: {en: "\" exists. Delete?", fr: "\" existe. Supprimer?", de: "\" existiert. L\u00F6schen?"},
        dlg_custom: {en: "[Custom]", fr: "[Personnalisée]", de: "[Benutzerdefiniert]"},
        dlg_yes: {en: "Yes", fr: "Oui", de: "Ja"},
        dlg_no: {en: "No", fr: "Non", de: "Nein"},
        dlg_save_chain: {en: "Save chain", fr: "Enregistrer la chaîne", de: "Kette speichern"},
        dlg_standard: {en: "Query chain", fr: "Chaîne de requêtes", de: "Abfragekette"},
        dlg_name: {en: "Name:", fr: "Nom:", de: "Name"}
        }
    }


function show_grep (list_obj)
    {
    if (app.version[0] == "5")
        show_grep_cs3 (list_obj);
    else
        show_grep_cs4 (list_obj);
    }

function show_grep_cs3 (list_obj)
    {
    var grep;
    var str = "";
    for (var i = 0; i < list_obj.length; i++)
        {
        var f = File (app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/Grep/" + list_obj[i].text + ".xml");
        f.open ("r");
        f.encoding = "binary";
        grep = f.read ();
        f.close ();
        grep = grep.match (/<FindExpression value=\"(.+)\">/);
        if (grep != null)
            str += list_obj[i].text + ":\t" + readable (grep[1]) + "\r\r";
        else
            str += list_obj[i].text + ":\t" + "-------\r\r";
        }
    alert (str);
    }


function show_grep_cs4 (list_obj)
    {
    var temp, find_what, change_to;
    var str = "";
    var w = new Window ("dialog")
        var list = w.add ("listbox", undefined, undefined, {numberOfColumns: 3, showHeaders: true, columnTitles: ["Query", "Find what", "Change to"]});
        try {list.graphics.font = "Tahoma:16.0"} catch (_) {};
        w.add ("button", undefined, "Close", {name: "ok"})
    for (var i = 0; i < list_obj.length; i++)
        {
        var f = File (app.scriptPreferences.scriptsFolder.parent.parent + "/Find-Change Queries/Grep/" + list_obj[i].text + ".xml");
        f.open ("r");
        f.encoding = "binary";
        temp = f.read ();
        f.close ();
        find_what = temp.match (/<FindExpression value=\"(.+)\">/);
        change_to = temp.match (/<ReplaceExpression value=\"(.+)\">/);
        with (list.add ("item", list_obj[i].text))
            {
            subItems[0].text = ((find_what == null) ? "-------" : readable (find_what[1]));
            subItems[1].text = ((change_to == null) ? "-------" : readable (change_to[1]));
            }
        }
    w.show ();
    }


function readable (s)
    {
    s = s.replace (/&lt;/g, "<");
    s = s.replace (/&gt;/g, ">");
    s = s.replace (/\(\?#\)/g, "\r");
    return s
    }
