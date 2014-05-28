// DESCRIPTION: place the insertion point in the designated line
// Peter Kahrel -- www.kahrel.plus.com

#target indesign;
#targetengine "session";

try {if (app.selection[0] instanceof InsertionPoint) {goto_line ()}} catch (_){alert ("Select an insertion point"); exit ()};


function goto_line ()
	{
	var w = Window.find('palette', 'Go to line');
	if (w === null)
		w = goto_line_sub ();
	w.show ();
	}

function goto_line_sub () {
    var w = new Window ('palette {text: "Go to line", orientation: "row", alignChildren: ["left", "top"]}');
        var gr = w.add ("group");
            gr.add ("statictext", undefined, "Go to line ");
            var line = gr.add ('edittext {text: "0", active: true, characters: 2}');
        var buttons = w.add ('group {orientation: "column", alignChildren: "fill"}');
            buttons.add ("button", undefined, "From top of page");
            buttons.add ("button", undefined, "Down from insertion point");
            buttons.add ("button", undefined, "From bottom of page");
            buttons.add ("button", undefined, "Up from insertion point");

            buttons.addEventListener('click', button_pressed);

            function button_pressed (e)
                {
                if (e.target.type == "button")
                    {
                    var tf = app.selection[0].parentTextFrames[0]; 
                    switch (e.target.text)
                        {
                        case "From top of page": var y = Number(line.text)-1; break;
                        case "Down from insertion point": var y = current (app.selection[0]) + Number(line.text)-1; break;
                        case "From bottom of page": var y = tf.lines.length - Number(line.text); break;
                        case "Up from insertion point": var y = current (app.selection[0]) - Number(line.text)-1;
                        }
                    if (y <= tf.lines.length) {tf.lines[y].select();}
                    } // if (e.target
                }  // button_pressed

            function current (ip) {
                var tf = app.selection[0].parentTextFrames[0];
                return tf.insertionPoints.itemByRange (tf.insertionPoints[0], app.selection[0]).lines.length;
                }
	return w;
    }