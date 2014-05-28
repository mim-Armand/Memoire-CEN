//DESCRIPTION: Sort a table
// Peter kahrel -- www.kahrel.plus.com

// Details at www.kahrel.plus.com/indesign/tablesort.html

#target indesign;

try {main ()}
    catch (e) {alert (e.message + " (" + e.line + ")")};


function main ()
    {
    var table = get_table ();
    var params = response (table);
    sort_table (table, params)
    }


function sort_table (table, o)
    {
    app.scriptPreferences.enableRedraw = false;
    // get the index of the last row to be included in the sort
    var last = table.rows.length - o.footers;
    // add dummy columns (the table is in fact sorted on these
    add_columns (table, o.column_order, o.ignore_case);
    // determine which columns are numerical
    num_column (table, o.anumeric, o.column_order.length);
    if (o.formatted == true)
//~         sort_formatted (table, o.headers, last-1, o.descend);
        sort_formatted (table, last-1, o);
    else
//~         sort_unformatted (table, o.headers, last, o.descend);
        sort_unformatted (table, last, o);
    // delete the dummy columns
    delete_columns (table, o.column_order.length);
    }


// Unformatted sort =========================================================================

function sort_unformatted (table, footers, o)
    {
//~     var t0 = get_time ();
    var array = table_to_array (table, o.headers, footers);
    if (o.descend) {array.sort (descend_sort);}
    else {array.sort ();}
    array_to_table (table, array, o.headers);
    //~ $.writeln (time_diff (t0));
    }


// Pull the whole table into an array
function table_to_array (table, first, last)
    {
    var r = table.rows.everyItem().getElements();
    var array = [];
//~     var stop = r.length - last;
    for (var i = first; i < last; i++)
        array.push (r[i].contents.join ("£"));
//~     array = table.rows.itemByRange (first, table.rows.length-last-1).rows.everyItem().contents;
    return array
    }

function descend_sort (a, b) {return a < b;}

// Replace the table contents with the sorted array
function array_to_table (table, array, first)
    {
    var r = table.rows.everyItem().getElements();
    for (var i = 0; i < array.length; i++)
        r[first+i].contents = array[i].split ("£");
//~     var r = table.rows.itemByRange (first, table.rows.length-1).rows.everyItem().getElements();
//~     for (var i = 0; i < array.length; i++)
//~         r[i].contents = array[i];
    }

// Formatted sort ======================================================================


function sort_formatted (tbl, last, o)
    {
    // add a column at the end: this is used for swapping
    tbl.rows.add ();
    // get all rows into an array
    var array = tbl.rows.everyItem().getElements ();
    sort_formatted_sub ( tbl, array, o.headers, last, array[array.length-1], o.descend, array[0].cells.length );
    // delete the swap row
    tbl.rows[-1].remove ()
    }


// Classic quicksort

function sort_formatted_sub ( tbl, rows, first, last, last_row, dir, row_length )
    {
    var i = first; var j = last;
    var pivot = tbl.columns[0].cells[Math.floor ( (first+last)/2)].contents;
    while ( i < j )
        {
        while ( larger_than ( pivot, tbl.columns[0].cells[i].contents, dir ) )
            i++;
        while ( larger_than ( tbl.columns[0].cells[j].contents, pivot, dir ) )
            j--;
        if ( i <= j )
            {
            swap_rows ( rows, i, j, last_row, row_length);
            i++;
            j--;
            }
        }
    if ( first < j ) sort_formatted_sub ( tbl, rows, first, j, last_row, dir, row_length );
    if ( i < last ) sort_formatted_sub ( tbl, rows, i, last, last_row, dir, row_length );
    }

/* Swap_rows swaps rows by moving a row x into the dummy row,
row y into row x, and the dummy into row y. As we can't move rows,
we have to move the contents of the cells. */

function swap_rows (r, x, y, last_row, le)
    {
    if (x != y)
        {
        for( var i = 0; i < le; i++ )
            r[x].cells[i].texts[0].move (LocationOptions.after, last_row.cells[i].insertionPoints[0]);
        for( var i = 0; i < le; i++)
            r[y].cells[i].texts[0].move (LocationOptions.after, r[x].cells[i].insertionPoints[0]);
        for( var i = 0; i < le; i++ )
           last_row.cells[i].texts[0].move (LocationOptions.after, r[y].cells[i].insertionPoints[0]);
        }
    }


function larger_than (a, b, descend)
    {
    if (descend) return a < b;
    else return a > b;
    }



// Common things ======================================================================

// "le" is the length of the array of column numbers to be sorted

function num_column (table, bool_array, le)
    {
    for (var i = 0; i < le; i++)
        if (bool_array[i])
            pad_column (table.columns[i])
    }


// Pad a column wih numbers

function pad_column (col)
    {
    var array = col.contents;
    var longest = find_longest (array);
    var pad_string = padder (longest);
    for (var i = 0; i < array.length; i++)
        array[i] = (pad_string + array[i]).slice (-longest);
    col.contents = array;
    }


function find_longest (array)
    {
    var longest = array[0].length;
    for (var i = 1; i < array.length; i++)
        longest = Math.max (longest, array[i].length);
    return longest
    }

function padder (n)
    {
    var s = "0";
    for (var i = 0; i < n; i++)
        s += "0";
    return s
    }

// Add dummy coumns that we use to sort on.
// The number of columns is taken from the interface
function add_columns (table, order, ign_case)
    {
    // update the order array
    for (var i = 0; i < order.length; i++)
        order[i] = order[i]-1+order.length;
    for (var i = 0; i < order.length; i++)
        table.columns.add (LocationOptions.atBeginning);
    for (var i = 0; i < order.length; i++)
        {
        table.columns[i].contents = table.columns[order[i]].contents;
        if (ign_case)
            {
            var cells = table.columns[i].cells.everyItem().getElements();
            var stop = cells.length;
            for (var j = 0; j < stop; j++)
                cells[j].contents = cells[j].contents.toLowerCase();
            }
        }
    }


// Delete the dummy columns

function delete_columns (table, n)
    {
    table.columns.itemByRange (0, n-1).remove ();
    }


// Interface =============================================================

function response (table)
    {
    var w = new Window ("dialog", "Table sort");
        w.orientation = "row";
        w.alignChildren = "top";
        var main = w.add ("panel");
        main.orientation = "column";
        main.alignChildren = "fill";
        var order = main.add ("panel", undefined, "Sort order");
            order.alignChildren = "right";
            var columns = [];
            var anum = [false, false, false];
            var g1 = order.add ("group");
                g1.add ("statictext", undefined, "First sort on column" );
                columns[0] = g1.add ("edittext", undefined, "");
                anum[0] = g1.add ("checkbox", undefined, "\u00A0Numeric");
            var g2 = order.add ("group");
                g2.add ("statictext", undefined, "Then on column" );
                columns[1] = g2.add ("edittext", undefined, "");
                anum[1] = g2.add ("checkbox", undefined, "\u00A0Numeric");
            var g3 = order.add ("group");
                g3.add ("statictext", undefined, "Then on column" );
                columns[2] = g3.add ("edittext", undefined, "");
                anum[2] = g3.add ("checkbox", undefined, "\u00A0Numeric");
            columns[0].characters = columns[1].characters = columns[2].characters = 2;
            
        var headers = main.add ("panel", undefined, "Headers/footers");
            headers.alignChildren = "right";
            var h1 = headers.add ("group");
                h1.add ("statictext", undefined, "Number of header rows:" );
                var head = h1.add ("edittext", undefined, "0");
            var h2 = headers.add ("group");
                h2.add ("statictext", undefined, "Number of footer rows:" );
                var foot = h2.add ("edittext", undefined, "0");
            head.characters = foot.characters = 2;

        var direction = main.add ("panel", undefined, "Direction");
            direction.orientation = "row";
            var ascend = direction.add ("radiobutton", undefined, "\u00A0Ascending");
            var descend = direction.add ("radiobutton", undefined, "\u00A0Descending");
            ascend.value = true;

        var misc = main.add ("panel");
            misc.alignChildren = "left"
            var ignore_case = misc.add ("checkbox", undefined, "\u00A0Ignore case");
            var formatted = misc.add ("checkbox", undefined, "\u00A0Formatted text");
            ignore_case.value = true;
            formatted.value = false;
        
        var buttons = w.add ("group");
            buttons.orientation = "column";
            buttons.add ("button", undefined, "Ok", {name: "ok"});
            buttons.add ("button", undefined, "Cancel", {name: "cancel"});
        
        // Check if some rows are selected. If so, calculate the number of headers and foorter
        // and disable the header/footer section
        var head_foot = headers_footers (table);
        head.text = head_foot [1];
        foot.text = head_foot [2];
        if (head_foot[0] == true)
            headers.enabled = false;
        
        // Check which columns are selected
        var cols = find_columns (table);
        for (var i = 0; i < cols.length; i++)
            columns[i].text = cols[i];
        
        columns[0].active = true;
       
    if (w.show () == 1)
        {
        var obj = {
            column_order: col_order (columns, table.columns.length),
            anumeric: [anum[0].value, anum[1].value, anum[2].value],  // array of booleans
            descend: descend.value,
            headers: Number (head.text),
            footers: Number (foot.text),
            formatted: formatted.value,
            ignore_case: ignore_case.value
            }
        w.close ();
        return obj
        }
    else
        {
        w.close ();
        exit ()
        }
    }


function col_order (array, le)
    {
    var num;
    var temp = [];
    for (var i = 0; i < array.length; i++)
        {
        num = Number (array[i].text);
        if (isNaN (num) || num > le)
            errorM ("Illegal column number for column " + String (i+1));
        if (num > 0)
            temp.push (num);
        }
    return temp;
    }


function headers_footers (table)
    {
    if (app.selection[0] instanceof Cell && app.selection[0].rows.length > 1)
        {
        var c = app.selection[0].cells;
        var header = c[0].parentRow.index;
        var footer = c[-1].parentColumn.cells.length - c[-1].parentRow.index - 1;
        // Add a boolean that dims the header/footer panel
        return [true, header, footer];
        }
    else
        return [false, table.headerRowCount, table.footerRowCount];
    }


// Get the number of the selected column so we can plug that into the dialog

function find_columns ()
    {
    // insertion point selected
    if (app.selection[0].parent instanceof Cell)
        return [String (app.selection[0].parent.parentColumn.index + 1)];
    // several columns selected
    if (app.selection[0] instanceof Cell && app.selection[0].columns.length > 1)
        {
        var temp = [];
        for (var i = 0; i < app.selection[0].columns.length; i++)
            if (i < 3) temp.push (String (app.selection[0].columns[i].index + 1));
        return temp
        }
    // More than one cell selected in the same column
    if (app.selection[0] instanceof Cell && app.selection[0].rows.length > 0)
        return [String (app.selection[0].parentColumn.index + 1)];
    // If nothing else works, this will
    return ["1"]
    }


// General ==============================================================


function get_table ()
    {
    if (app.documents.length == 0) exit ();
    if (app.selection.length == 0) errorM ("Select an insertion point in a table or some rows.");
    if (app.selection[0].parent instanceof Cell)
        return app.selection[0].parent.parent;
    if (app.selection[0] instanceof Cell)
        return app.selection[0].parent;
    errorM ("Select an insertion point in a table or some rows.");
    }


function errorM (m)
    {
    alert (m, "Table sort", true);
    exit ();
    }


function get_time () {return new Date ().getTime ()}
function time_diff (start) {return (new Date () - start) / 1000}
