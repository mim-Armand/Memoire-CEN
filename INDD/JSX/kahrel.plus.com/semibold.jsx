try
    {
    switch (app.selection[0].fontStyle.toLowerCase())
        {
        case "regular": case "roman":
            {try {app.selection[0].fontStyle = get_sb()}
                catch (_) {app.selection[0].fontStyle = "Bold"};
            break
            }
        case "italic":
            {try {app.selection[0].fontStyle = get_sb() + " Italic"}
                catch (_) {app.selection[0].fontStyle = "Bold Italic"};
            break
            }
        case "semibold": case "bold":
            {try {app.selection[0].fontStyle = "Regular"}
                catch (_) {app.selection[0].fontStyle = "Normal"};
            break
            }
        case "semibold italic": case "bold italic":
            {try {app.selection[0].fontStyle = "Italic"}
                catch (_) {}
            break
            }
        }
    }
catch (_){}



function get_sb ()
    {
    var bold = "Bold";
    try {app.selection[0].fontStyle = "SemiBold"; bold = "SemiBold"}
        catch (_)
            {
            try {app.selection[0].fontStyle = "Semibold"; bold = "Semibold"}
                catch (_) {}
            }
    return bold;
    }