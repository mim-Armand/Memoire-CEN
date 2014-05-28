//DESCRIPTION: set number of footnote lines to keep together
// Peter Kahrel -- www.kahrel.plus.com

try
    {
    var ip = app.selection[0];
    var LL = ip.paragraphs[0].insertionPoints.itemByRange (ip, ip.paragraphs[0].insertionPoints[-1]).lines.length;
    ip.paragraphs[0].keepLinesTogether = true;
    ip.paragraphs[0].keepLastLines = LL
    }
catch (_) {};