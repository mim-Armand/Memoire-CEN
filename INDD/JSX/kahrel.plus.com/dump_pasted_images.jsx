//DESCRIPTION: "Unpaste" pasted images
// Peter Kahrel -- www.kahrel.plus.com

// Pasted images (i.e. images without a link in the Links panel)
// are written on disk in a subdirectory of the current document's folder.
// The subdir is called "/images".
// Images can be linked or deleted

#target indesign;

try {if (app.documents.length > 0)
		unembed_images ()}
	catch (e) {alert (e.message + "\r(line " + e.line + ")")};


function unembed_images ()
	{
	var doc = app.documents[0];
	var outfolder = GetOutFolder();
	var image_file, n = 0, g = doc.allGraphics;
	if (pasted_graphics(g))
		var export_data = get_format ();
	for (var i = g.length-1; i > -1; i--)
		{
		if (g[i].itemLink == null)
			{
			image_file = File (outfolder + String (n++) + export_data.extension);
			if (export_data.extension == ".EPS")
				export_eps (g[i], image_file);
			else
				g[i].exportFile (export_data.enum_type, image_file);
			if (export_data.create_link)
				g[i].parent.place (image_file);
			else
				g[i].parent.remove ();
			}
		else
			{
			 if (g[i].itemLink.status === LinkStatus.linkEmbedded)
				g[i].itemLink.unembed(outfolder);
			}
		}
	}


function GetOutFolder ()
	{
	var e;
	try {var f = Folder (app.activeDocument.fullName.path).selectDlg();}
		catch(e){alert(e.message); exit();}
	if (f === null)
		exit();
	else
		return f;
	}


function pasted_graphics(array)
	{
	var z = array.length;
	for (var i = 0; i < z; i++)
		if (array[i].itemLink == null)
			return true;
	return false;
	}

function get_format ()
	{
	var export_enums = [ExportFormat.epsType, ExportFormat.jpg, ExportFormat.pngFormat];
	var w = new Window ("dialog", "Save pasted images");
	w.alignChildren = "left";
		var g1 = w.add ("panel");
		g1.orientation = "row";
		g1.add ("statictext", undefined, "Export format: ");
		format_ = g1.add ("dropdownlist", [0,0,160,22], ["EPS", "JPEG", "PNG"]);
		var link = w.add ("checkbox", undefined, " Create links\u00A0");
		var buttons = w.add ("group");
		buttons.alignment = "right"
		buttons.add ("button", undefined, "OK", {name: "ok"});
		buttons.add ("button", undefined, "Cancel", {name: "cancel"});

	var previous = read_history ("/unembed_images.txt");
	format_.selection = previous.format;
	if (previous.create_links)
		link.value = true;
	
	if (w.show () == 1)
		{
		w.close ();
		write_history ("/unembed_images.txt", "Format="+format_.selection.index+"\rLink="+link.value);
		return {extension: "." + format_.selection.text, 
				enum_type: export_enums [format_.selection.index],
				create_link: link.value};
		}
	else
		{
		w.close ();
		exit ();
		}
	}


function subdir (doc)
	{
	try {var doc_path = String (doc.filePath)}
	catch (e)
		{
		alert (e.message);
		exit ()
		}
	var temp = doc_path + "/images";
	if (!Folder (temp).exists)
		Folder (temp).create ();
	return temp
	}


function export_eps (im, f)
	{
	var gb = im.parent.geometricBounds;
	var d = app.documents.add (false);
	// Separate try-catch-finally here (apart from the global one)
	// to make sure that we don't end up with documents without a layout window
	try
		{
		d.documentPreferences.pageHeight = gb[2] - gb[0];
		d.documentPreferences.pageWidth = gb[3] - gb[1];
		var dupl = im.parent.duplicate (d.pages[0]);
		dupl.move ([0, 0]);
		dupl.exportFile (ExportFormat.epsType, f);
		}
	catch (_) {}
	finally {d.close (SaveOptions.no)}
	}


function read_history (fstring)
	{
	var f = File (app.scriptPreferences.scriptsFolder + fstring);
	if (f.exists)
		{
		f.open ("r");
		var temp = f.read ();
		f.close ();
		return {format: temp.match (/Format=(\d)/)[1],
				create_links: eval (temp.match (/Link=(.*)/)[1]) }
		}
	else
		return {format: 1,
				create_links: true };
	return temp
	}


function write_history (fstring, num)
	{
	var f = File (app.scriptPreferences.scriptsFolder + fstring);
	f.open ("w");
	f.write (String (num));
	f.close ();
	}