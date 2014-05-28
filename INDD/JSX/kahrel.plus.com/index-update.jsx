//DESCRIPTION: re-range page numbers
// Peter Kahrel -- www.kahrel.plus.com

// Global constants =======================================================================

page_span = 1;
drop_digits = false;

/*=========================================================================================

Expand page ranges, sort, and do page ranges again. 
Handles arabic and roman page numbers.
Example: you start with this:

Leech, G., ii, iv, 1, 2, 3, 7, 10, 21, 22, 23
Leech, G., iii, vi, 14, 6, 8, 9, 10, 15, 11, 22, 23

Combine this manually to get this (just delete the name on the second line):

Leech, G., ii, iv, 1, 2, 3, 7, 10, 21, 22, 23, iii, vi, 14, 6, 8, 9, 10, 15, 11, 22, 23

Run the script to get this:

Leech, G., ii–iv, vi, 1–3, 6–11, 14–15, 21–23

The script handles existing page ranges. If you start with this:

Leech, G., ii-iv, 1, 2, 3, 7, 10-14, 21-23
Leech, G., iii, vi, 6, 8-10, 14, 15, 11, 22, 23

Combine these manually to this:

Leech, G., ii-iv, 1, 2, 3, 7, 10-14, 21-23, iii, vi, 6, 8-10, 14, 15, 11, 22, 23

Run the script to get this:

Leech, G., ii–iv, vi, 1–3, 6–15, 21–23


The page_span variable controls if consecutive page numbers
are ranged (1, 2, 3 > 1-3) and if yes, by what margin.
"0" means 'no ranging at all'; "1" is the standard ranging of
consecutive numbers; "2" allows for gaps of one page. By increasing
the page_span, the spanner becomes more tolerant. Examples:

page_span = 0: page ranges are removed
page_span = 1: '1, 2, 3, 4, 6, 8' > '1-4, 6, 8'
page_span = 2: '1, 2, 3, 4, 6, 8' > '1-6, 8'
page_span = 3: '1, 2, 3, 4, 6, 8' > '1-8'
etc.

=========================================================================================*/

#target indesign;

if (app.documents.length > 0 && app.selection.length > 0)
        rerange_index ();

//------------------------------------------------------------------------------------------

function rerange_index ()
    {
    sel = app.selection[0];
    switch (sel.constructor.name)
        {
        case "InsertionPoint":
            {
            var p = app.selection[0].paragraphs[0];
            p.characters.itemByRange (0,-1).contents = rerange_entry (p.contents);
            break
            }
        case "TextFrame":
            {
            var p = app.selection[0].parentStory.paragraphs.everyItem().getElements();
            for (var i = p.length-1; i > -1; i--)
                try {p[i].contents = rerange_entry (p[i].contents)} catch (_){}
            break
            }
        default: {alert ("Select insertion point or text frame.", "Index re-range", true); exit()}
        }
    }


function rerange_entry (s)
    {
//~     var entry = s.match (/([^\d]+)(.+)/);
    // split s on the space between the entry and the first page number,
    // which can be arabic, roman, or a range of either. "Page number" is therefore
    // defined as "a space followed by a string consisting of hyphens, dashes, digits, 
    // and/or the letters i, v, x, followed by a comma".
    var entry = s.match (/^(.+?\s)(?=[-ivxc\d\u2013]+,)(.+)/)
    // first part is the topic
    var topic = entry[1];
    // second part, the page numbers
    var p_nums = entry[2].replace (/\r$/,"");
    p_nums = p_nums.split (/, ?/);
    p_nums = rerange (p_nums).join (", ");
    if (drop_digits == true)
        p_nums = dropdigits (p_nums);
    return topic + p_nums + "\r";
    }


function dropdigits (s)
    {
    s = s.replace (/\b(\d+)(\d+[-\u2013])\1(\d+)\b/g, "$1$2$3");
    s = s.replace (/(1\d[-\u2013])(\d)\b/g, "$11$2")
    return s
    }


function rerange (s)
    {
    // split array into two: one roman, the other, arabic
    var page_nums = split_roman_arabic (s);
    page_nums.arabic = unrange_sort_range (page_nums.arabic);
    if (page_nums.roman.length > 2)
        {
        // convert roman numbers to arabic
        page_nums.roman = to_arabic (page_nums.roman);
        page_nums.roman = unrange_sort_range (page_nums.roman)
        // convert the arabic numbers in the roman array back to roman
        page_nums.roman = arabic_array_to_roman (page_nums.roman);
        }
    // concatenate the arrays
    var page_nums = page_nums.roman.concat (page_nums.arabic);
    return page_nums
    }


function unrange_sort_range (array)
    {
    array = unrange (array);
    array = array.sort (sort_arab);
    array = remove_doubles (array);
    array = range_pages (array)
    return array
    }


// return two element object, each element an array,
// one of roman numbers, the other of arabic numbers

function split_roman_arabic (array)
    {
    var roman = [];
    var arab = [];
    for (var i = 0; i < array.length; i++)
        {
        if (array[i].match (/^[-\u2013\d]+$/) != null)
            arab.push (array[i]);
        else
            roman.push (array[i]);
        }
    return {roman: roman, arabic: arab}
    }

/*
    To convert an array of roman numbers, convert to string, 
    then convert the numbers, finally convert back to array.
    This seems the easiest way to deal with page ranges.
*/

function to_arabic (array)
    {
    var s = array.join (",");
    s = s.replace (/(\w+)/g, roman2arabic)
    return s.split(",")
//    return s
    }


function arabic_array_to_roman (array)
    {
    var s = array.join (",");
    s = s.replace (/\w+/g, arabic2roman);
    array = s.split (",")
//~     for (var i = 0; i < array.length; i++)
//~         array[i] = arabic2roman (array[i]);
    return array
    }


function sort_arab (a, b)
    {
    return a - b
    }



function sort_roman (a, b)
    {
    return roman2arabic (a) - roman2arabic (b)
    }


function arabic2roman (arab)
    {
    var roman = ''
    if (arab < 10000)
        {
        var rom = [];
        rom[0] = ["","i","ii","iii","iv","v","vi","vii","viii","ix"];
        rom[1] = ["","x","xx","xxx","il","l","lx","lxx","lxxx","xc"];
        rom[2] = ["","c","cc","ccc","cd","d","dc","dcc","dccc","cm"];
        rom[3] = ["","m","mm","mmm","4m","5m","6m","7m","8m","9m"];
        arab = arab.toString().split("").reverse().join("");
        for (var i = 0; i < arab.length; i++)
            roman = rom[i][arab.charAt(i)] + roman;
        }
    return roman
}

//---------------------------------------------------------


function roman2arabic (roman)
    {
    var arabic = rom2arab (roman.substr (-1));
    for (var i = roman.length-2; i > -1; i--)
        if (rom2arab (roman[i]) < rom2arab (roman[i+1]))
            arabic -= rom2arab (roman[i]);
        else
            arabic += rom2arab (roman[i]);
    return arabic
    }


function rom2arab (rom_digit)
    {
    switch (rom_digit)
        {
        case "i": return 1;
        case "v": return 5;
        case "x": return 10;
        case "l": return 50;
        case "c": return 100;
        case "d": return 500;
        case "m": return 1000;
        default: return "Illegal character"
        }
    }



function unrange (array)
    {
    var s = array.join (",");
    s = s.replace (/(\d+)[-\u2013](\d+)/g, expand_num);
    return s.split (",");
    
    function expand_num ()
        {
        var expanded = "";
        if (arguments[1].length > arguments[2].length)
            arguments[2] = undrop (arguments[1], arguments[2]);
        var start = Number (arguments[1]);
        var stop = Number (arguments[2]);
        for (var i = start; i < stop; i++)
            expanded += i + ",";
        expanded += stop;
        return expanded
        }
        // 123-6 > 123-126
        function undrop (from, to)
            {
            return from.slice (0, from.length-to.length) + to
            }
    }




function remove_doubles (array)
    {
    var s = array.join("\r")+"\r";
    s = s.replace(/([^\r]+\r)(\1)+/g,"$1");
    s = s.replace(/\r$/,"");
    return s.split ("\r");
    }


function range_pages (array)
    {
//    array = sort_and_compress (array);
    var temp = [];
    var i = 0;
    if (page_span > 0)
        {
        while (i < array.length)
            {
            if ( (array[i+1] - array[i] <= page_span) && (i < array.length))
                {
                var range = array[i] + "\u2013";
                while ( (array[i+1] - array[i] <= page_span) && (i < array.length))
                    i++;
                temp.push (range+array[i])
                }
            else
                temp.push (array[i]);
            i++
            }
//~        return temp.join (", ")
            return temp
        }
    else
//~         return array.join (", ")
        return array
    }
