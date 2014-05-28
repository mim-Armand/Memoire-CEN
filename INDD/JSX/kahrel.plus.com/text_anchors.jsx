//DESCRIPTION: Show all text anchors, select unused ones.
//Peter Kahrel -- www.kahrel.plus.com

#target indesign;
#targetengine session;

main ();

function main ()
	{
	var names = get_anchors (app.activeDocument);
	var w = new Window ('palette', 'Text anchors', undefined, {closeButton: false});
		w.orientation = 'row';
		var list = w.add ('listbox', undefined, undefined,
			{numberOfColumns: 2, showHeaders: true, 
				columnTitles: ["Text anchor", "Hyperlink"], multiselect: true,
				columnWidths: [200, 150]});		
		
		var b = w.add ('group {orientation: "column", alignment: "top", alignChildren: "fill"}');
			var go_to = b.add ('button', undefined, 'Go to selected');
			var sel_unused = b.add ('button', undefined, 'Select unused');
			var del_selected = b.add ('button', undefined, 'Delete selected');
			var close = b.add ('button', undefined, 'Close', {name: 'Cancel'});

		var list_item;
		for (var i = 0; i < names.length; i++)
			{
			list_item = list.add ('item', names[i].val);
			if (names[i].hlink != undefined)
				list_item.subItems[0].text = names[i].hlink;
			}
		
//~ 		list.preferredSize.height = names.length * 19

		list.onChange = function ()
			{
			if (list.selection == null)
				{
				go_to.enabled = del_selected.enabled = false;
				return;
				}

			go_to.enabled = (list.selection.length == 1);
			del_selected.enabled = true;
			for (var i = list.selection.length-1; i > -1; i--)
				{
				if (list.selection[i].subItems[0].text != "")
					{
					del_selected.enabled = false;
					break;
					}
				}
			}

		go_to.onClick = list.onDoubleClick = function ()
			{
			var ip = app.activeDocument.hyperlinkTextDestinations.item (list.selection[0].text).destinationText;
			ip.select();
			app.documents[0].layoutWindows[0].zoomPercentage = 500;
			}

		del_selected.onClick = function ()
			{
			for (var i = list.selection.length-1; i > -1; i--)
				{
				if (list.selection[i].subItems[0].text == "")
					{
					app.activeDocument.hyperlinkTextDestinations.item (list.selection[i].text).remove();
					list.remove (list.selection[i]);
					}
				}
			if (list.items.length > 0)
				list.selection = 0;
			}

		
		sel_unused.onClick = function ()
			{
			var i, u = [];
			for (i = list.items.length-1; i > -1; i--)
				{
				if (list.items[i].subItems[0].text == "")
					u.push(i);
				}
			list.selection = u;
			}
		
		close.onClick = function (){w.close()}
		

		w.onShow = function ()
			{
//~ 			w.location = {x: $.screens[0].right - (w.frameBounds[2] - w.frameBounds[0]+5), 
//~ 									y: w.bounds[1] - w.frameBounds[1]+10}
			list.selection = null;
			list.notify();
			
			}
		
	w.show ();
	}


function get_anchors (doc)
	{
	var i, 
		anchor_links = {},
		names = [],
		hlinks = doc.hyperlinks.everyItem().getElements();
		anchors = doc.hyperlinkTextDestinations.everyItem().getElements();

	// Create an associative array of text anchors used as targets
	// for hyperlinks and cross-references
	
	for (i = 0; i < hlinks.length; i++)
		{
		if (hlinks[i].destination instanceof HyperlinkTextDestination)
			anchor_links[hlinks[i].destination.name] = hlinks[i].name;
		}

	// Create an array of text-anchor names, and add a property 'true' if the anchor
	// is used as a target, otherwise 'false'. The 'key' key is used to sort the list for
	// the panel (accents removed, case-insensitive letter-by-letter sort).
	
	// A complication is that bookmarks too use anchors. To check if an anchor is
	// associated with a bookmark, see if there is a bookmark whose destination id
	// is the same as the anchor (a bookmark's destination is an anchor).
	
	// Create an associative array of all bookmark destination ids
	
	var bm_ids = get_bm_ids (doc);
	
	// Create the array of anchor names

	for (i = 0; i < anchors.length; i++)
		{
		if (!(anchors[i].id in bm_ids)) // if the anchor is not associated with any bookmark
			{
			names.push ({key: unaccent(anchors[i].name.toUpperCase()), 
									val: anchors[i].name, 
									hlink: anchor_links[anchors[i].name]})
			}
		}

	return names.sort (function (a,b) {return a.key > b.key});
	}


function get_bm_ids (doc)
	{
	var o = {};
	var bm = doc.bookmarks.everyItem().getElements();
	for (var i = 0; i < bm.length; i++)
		o[bm[i].destination.id] = true;
	return o;
	}


function unaccent (s)
	{
	return s.replace (/[_\x20]/g, "").
	replace (/[ÁÀÂÄÅĀĄĂÆ]/g, "A").
	replace (/[ÇĆČĊ]/g, "C").
	replace (/[ĎĐ]/g, "D").
	replace (/[ÉÈÊËĘĒĔĖĚ]/g, "E").
	replace (/[ĢĜĞĠ]/g, "G").
	replace (/[ĤĦ]/g, "H").
	replace (/[ÍÌÎÏĪĨĬĮİ]/g, "I").
	replace (/[Ĵ]/g, "J").
	replace (/[Ķ]/g, "K").
	replace (/[ŁĹĻĽ]/g, "L").
	replace (/[ÑŃŇŅŊ]/g, "N").
	replace (/[ÓÒÔÖŌŎŐØŒ]/g, "O").
	replace (/[ŔŘŖ]/g, "R").
	replace (/[ŚŠŜŞȘSS]/g, "S").
	replace (/[ŢȚŤŦ]/g, "T").
	replace (/[ÚÙÛÜŮŪŲŨŬŰŲ]/g, "U").
	replace (/[Ŵ]/g, "W").
	replace (/[ŸÝŶ]/g, "Y").
	replace (/[ŹŻŽ]/g, "Z");
	}
