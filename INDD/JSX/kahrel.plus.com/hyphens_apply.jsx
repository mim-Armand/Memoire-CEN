// Select a text frame with a wordlist in which breakpoints 
// are indicated with a swung dash (~).
// The script adds those words to the exception list
// To break words in the document(s) and keep them
// out of the exception list, prefix them with a %

// The script prompts you to select a language

#target indesign;

if (app.documents.length > 1){
	try {if (check_environment ()) apply_changes (app.documents[0])}
		catch (e) {alert (e.message + "\r(line " + e.line + ")")};
}


function apply_changes (doc){
	var language = get_language (doc);
	var mess___ = create_mess (30);
	app.findGrepPreferences = app.changeGrepPreferences = null;
	// Probably not necessary, but just make sure there aren't any stray returns
	fix_white ();
	var array = app.selection[0].parentStory.contents.split ("\r");
	var dict_list = [];
	var i;
	for (i = 0; i < array.length; i++){
		mess___.text = array[i];
		// If first character is %, handle word in document . . .
		if (array[i].charAt (0) == "%"){
			// remove %
			array[i] = array[i].replace (/^%/, "");
			app.findGrepPreferences.findWhat = array[i].replace (/[~]/g, "");
			app.changeGrepPreferences.changeTo = array[i].replace (/[~]/g, "\u00AD");
			app.changeGrep();
		} else {   // . . . add word to exception list
			dict_list.push (array[i]);
		}
	} // for
	app.userDictionaries.item (language).addWord (dict_list);
	mess___.parent.close ();
} // apply_changes


function get_language (){
	var app_lgs = app.languagesWithVendors.everyItem().name.sort ();
	// Get the language of the selection
	var current_lg = app.documents[0].stories[0].paragraphs[0].appliedLanguage.name;
	var w = new Window ('dialog', 'Select a language');
		w.alignChildren = "right";
		var language_panel = w.add ('panel');
			var language_group = language_panel.add ('group')
				language_group.add ('statictext', undefined, "Language:\u00A0");
				var language_list = language_group.add ('dropdownlist', undefined, app_lgs);
					language_list.preferredSize = [200,25];

		var button_group = w.add ('group');
//~             button_group.orientation = 'row';
			button_group.add ('button', undefined, 'OK', {name: "ok"});
			button_group.add ('button', undefined, 'Cancel', {name: "cancel"});
		
	language_list.selection = find_index (current_lg, app_lgs);

	if (w.show () == 2){
		exit ();
	} else {
		return language_list.selection.text;
	}
} // get_language


function find_index (item, array){
	for (var i = 0; i < array.length; i++){
		if (item == array[i]){
			return i;
		}
	}
	errorM ('Item out of bounds.');
}


function check_environment (){
	if (app.documents.length > 0 && app.selection.length > 0
		&& (app.selection[0] instanceof TextFrame || app.selection[0] instanceof InsertionPoint)
		&& app.selection[0].parentStory.paragraphs.length > 0) {
		return true;
	} else {
		errorM ("Select a textframe.");
		return false;
	}
}


function fix_white (){
	app.findGrepPreferences.findWhat = "\\s\\s+";
	app.changeGrepPreferences.changeTo = "\r";
	app.documents[0].changeGrep ();
	if (app.selection[0].parentStory.characters[-1].contents == "\r"){
		app.selection[0].parentStory.characters[-1].remove ();
	}
}


function errorM (m){
	alert (m, "Error", true);
	exit ();
}


function create_mess (le){
	dlg___ = new Window ('palette');
	dlg___.alignChildren = ['left', 'top'];
	txt___ = dlg___.add ('statictext', undefined, '');
	txt___.characters = le;
	dlg___.show();
	return txt___;
}
