#target indesign;

try{change_text_variables ();}
catch (e) {alert (e.message + " (" + e.line + ")")};


function change_text_variables ()
	{
	var textvars = get_variables (app.activeDocument);
	var w_title = "Update text variables";
	if (textvars["Journal"] !== undefined)
		w_title = textvars["Journal"];
	var vars_length = 0;
	for (var i in textvars) vars_length++;
	if (vars_length == 0) return;
	var longest = 0; for (var i in textvars) longest = Math.max (longest, i.length);
	var rows = 14; // number of rows in the dialog
	
	var w = new Window ('dialog', w_title, undefined, {closeButton: false});
		w.orientation = 'column'; w.alignChildren = "right"; w.maximumSize.height = 550;

		var main = w.add ("group"); 

		var p = main.add ('panel');
			p.maximumSize.height = p.preferredSize.height = 450;
			p.orientation = 'row'; p.alignChildren = "top"

		var sbar = main.add("scrollbar {preferredSize: [20,450], minvalue: 0, maxvalue: " + (vars_length-rows) + ", jumpdelta: 10}");

		var col1 = p.add ("group"); col1.orientation = "column"; col1.margins = 3;
		var col2 = p.add ("group"); col2.orientation = "column"; col2.preferredSize.width = 400; col2.alignChildren = "fill";

		var fields = {};
		var start = 0, stop = rows, n = -1;
		var col1_width = longest*6;
		for (var i in textvars)
			{
			++n;
			if (n >= start && n < stop)
				{
				col1.add ("statictext", [0,0,col1_width,20], i);
				fields[n] = col2.add ("edittext", undefined, textvars[i]);
				fields[n].index = i;
				}
			}

		for (var i in fields) fields[i].onChange = function () {
			textvars[this.index] = this.text;
		}


	var buttons = w.add ('group');
		buttons.add('button', undefined, 'OK', {name: "ok"});
		buttons.add ('button', undefined, 'Cancel', {name: "cancel"});


	sbar.onChanging = function()
		{
		shift = Math.round(this.value);
		if (shift <= vars_length-rows)
			scroll_panel(shift);
		}


	function scroll_panel (start)
		{
		var stop = start+rows;
		var n = 0; r = -1;
		for (var i in textvars)
			{
			n++;
			if (n > start && n <= stop)
				{
				++r;
				col1.children[r].text = i;
				fields[r].text = textvars[i];
				fields[r].index = i;
				}
			}
		}

	if (w.show() == 2)
		exit();
	var v = app.activeDocument.textVariables;
	for (var i in textvars)
		v.item (i).variableOptions.contents = textvars[i];
	} // change_text_variables


function get_variables ()
	{
	var o = {};
	var v = app.activeDocument.textVariables;
	for (var i = 0; i < v.length; i++)
		{
		if (v[i].variableType == VariableTypes.customTextType)
			o[v[i].name] = v[i].variableOptions.contents;
		}
	return o;
	}