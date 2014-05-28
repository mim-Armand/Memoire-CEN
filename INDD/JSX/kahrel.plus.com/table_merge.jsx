//DESRCRIPTION: Merge tables
//Peter Kahrel www.kahrel.plus.com

#target indesign;

try
    {
    check ()
    merge_tables ();
    }
catch (e) {alert (e.message + "\r(line " + e.line + ")")};


function merge_tables ()
    {
    var t = app.selection[0].parentStory.tables.everyItem().getElements();
    var t_length = t.length;
    var rows_to_move = 0;
    for (var i = 1; i < t_length; i++)
        rows_to_move += t[i].bodyRowCount;
    pb = progress_bar (rows_to_move, 'Merging tables...')
    var moved = 1;
    var rows_length, cells_length, j, k;
    for (var i = 1; i < t_length; i++)
        {
        rows_length = t[i].bodyRowCount;
        for (j = 0; j < rows_length; j++)
            {
            pb.value = moved++;
            t[0].rows.add ();
            cells_length = t[i].rows[j].cells.length;
            for (k = 0; k < cells_length; k++)
                t[i].rows[j].cells[k].texts[0].move ( 
                    LocationOptions.after, t[0].rows[-1].cells[k].insertionPoints[0]);
            }
        }
    for (var i = t_length -1; i > 0; i--)
        t[i].remove();
    }


function check ()
    {
    if (app.documents.length == 0 || app.selection.length == 0 || app.selection[0].tables.length == 0)
        {
        alert ("Select a story or some text containing more than one table.")
        exit()
        }
    }


function progress_bar (stop, title)
    {
    w = new Window ('palette', title);
    pb = w.add ('progressbar', undefined, 0, stop);
    pb.preferredSize = [300,20];
    w.show()
    return pb;
    }