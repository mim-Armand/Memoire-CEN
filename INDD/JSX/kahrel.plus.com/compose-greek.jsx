// Type polytonic Greek
// Peter Kahrel


#target indesign

app.selection[0].contents = combine (get_input());

function combine (s)
{
switch (s)
	{
	case "a" : return "\u03B1"	// alpha
	case "b" : return "\u03B2"	// beta
	case "g" : return "\u03B3"	// gamma
	case "d" : return "\u03B4"	// delta
	case "e" : return "\u03B5"	// epsilon
	case "z" : return "\u03B6"	// zeta
	case "h" : return "\u03B7"	// eta
	case "th" : return "\u03B8"	// theta
	case "i" : return "\u03B9"	// iota
	case "k" : return "\u03BA"	// kappa
	case "l" : return "\u03BB"	// lambda
	case "m" : return "\u00B5"	// mu
	case "n" : return "\u03BD"	// nu
	case "x" : return "\u03BE"	// xi
	case "o" : return "\u03BF"	// omicron
	case "p" : return "\u03C0"	// pi
	case "r" : return "\u03C1"	// rho
	case "s" : return "\u03C3"	// sigma
	case "?" : return "\u03C2"	// final sigma
	case "t" : return "\u03C4"	// tau
	case "u" : return "\u03C5"	// upsilon
	case "ph" : return "\u03C6"	// phi
	case "ch" : return "\u03C7"	// chi
	case "ps" : return "\u03C8"	// psi
	case "w" : return "\u03C9"	// omega
	case "A" : return "\u0391"	// ALPHA
	case "B" : return "\u0392"	// BETA
	case "G" : return "\u0393"	// GAMMA
	case "D" : return "\u0394"	// DELTA
	case "E" : return "\u0395"	// EPSILON
	case "Z" : return "\u0396"	// ZETA
	case "H" : return "\u0397"	// ETA
	case "TH" : return "\u0398"	// THETA
	case "I" : return "\u0399"	// IOTA
	case "K" : return "\u039A"	// KAPPA
	case "L" : return "\u039B"	// LAMBDA
	case "N" : return "\u039D"	// NU
	case "X" : return "\u039E"	// XI
	case "O" : return "\u039F"	// OMICRON
	case "P" : return "\u03A0"	// PI
	case "R" : return "\u03A1"	// RHO
	case "S" : return "\u03A3"	// SIGMA
	case "T" : return "\u03A4"	// TAU
	case "U" : return "\u03A5"	// UPSILON
	case "PH" : return "\u03A6"	// PHI
	case "CH" : return "\u03A7"	// chi
	case "PS" : return "\u03A8"	// PSI
	case "W" : return "\u03A9"	// OMEGA


	case 'A/' : return "\u0386";
	case 'E/' : return "\u0388";
	case 'H/' : return "\u0389";
	case 'I/' : return "\u038A";
	case 'O/' : return "\u038C";
	case 'U/' : return "\u038E";
	case 'W/' : return "\u038F";

	case 'i"/' : return "\u0390";
	case 'n"/' : return "\u03B0";

	case "a/": return "\u03AC";
	case "e/": return "\u03AD";
	case "h/": return "\u03AE";
	case "i/": return "\u03AF";

	case 'i"': return "\u03CA";
	case 'n"': return "\u03CB";
	case "o/": return "\u03CC";
	case "n/": return "\u03CD";
	case "w/": return "\u03CE";

	case "a'" : return "\u1F00";
	case "a`" : return "\u1F01";
	case "a'\\" : return "\u1F02";
	case "a`\\" : return "\u1F03";
	case "a'/" : return "\u1F04";
	case "a`/" : return "\u1F05";
	case "a~'" : return "\u1F06";
	case "a~`" : return "\u1F07";
	case "A'" : return "\u1F08";
	case "A`" : return "\u1F09";
	case "A'\\" : return "\u1F0A";
	case "A`\\" : return "\u1F0B";
	case "A'/" : return "\u1F0C";
	case "A`/" : return "\u1F0D";
	case "A~'" : return "\u1F0E";
	case "A~`" : return "\u1F0F";
	case "a\\" : return "\u1F70";
	case "a/" : return "\u1F71";
	case "e'" : return "\u1F10";
	case "e`" : return "\u1F11";
	case "e'\\" : return "\u1F12";
	case "e`\\" : return "\u1F13";
	case "e'/" : return "\u1F14";
	case "e`/" : return "\u1F15";
	case "E'" : return "\u1F18";
	case "E`" : return "\u1F19";
	case "E'\\" : return "\u1F1A";
	case "E`\\" : return "\u1F1B";
	case "E'/" : return "\u1F1C";
	case "E`/" : return "\u1F1D";
	case "e\\" : return "\u1F72";
	case "e/" : return "\u1F73";
	case "h'" : return "\u1F20";
	case "h`" : return "\u1F21";
	case "h'\\" : return "\u1F22";
	case "h`\\" : return "\u1F23";
	case "h'/" : return "\u1F24";
	case "h`/" : return "\u1F25";
	case "h~'" : return "\u1F26";
	case "h~`" : return "\u1F27";
	case "H'" : return "\u1F28";
	case "H`" : return "\u1F29";
	case "H'\\" : return "\u1F2A";
	case "H`\\" : return "\u1F2B";
	case "H'/" : return "\u1F2C";
	case "H`/" : return "\u1F2D";
	case "H~'" : return "\u1F2E";
	case "H~`" : return "\u1F2F";
	case "h\\" : return "\u1F74";
	case "h/" : return "\u1F75";
	case "I'" : return "\u1F30";
	case "I`" : return "\u1F31";
	case "I'\\" : return "\u1F32";
	case "I`\\" : return "\u1F33";
	case "I'/" : return "\u1F34";
	case "I`/" : return "\u1F35";
	case "I~'" : return "\u1F36";
	case "I~`" : return "\u1F37";
	case "I'" : return "\u1F38";
	case "I`" : return "\u1F39";
	case "I'\\" : return "\u1F3A";
	case "I`\\" : return "\u1F3B";
	case "I'/" : return "\u1F3C";
	case "I`/" : return "\u1F3D";
	case "I~'" : return "\u1F3E";
	case "I~`" : return "\u1F3F";
	case "i\\" : return "\u1F76";
	case "i/" : return "\u1F77";
	case "o'" : return "\u1F40";
	case "o`" : return "\u1F41";
	case "o'\\" : return "\u1F42";
	case "o`\\" : return "\u1F43";
	case "o'/" : return "\u1F44";
	case "o`/" : return "\u1F45";
	case "O'" : return "\u1F48";
	case "O`" : return "\u1F49";
	case "O'\\" : return "\u1F4A";
	case "O`\\" : return "\u1F4B";
	case "O'/" : return "\u1F4C";
	case "O`/" : return "\u1F4D";
	case "o\\" : return "\u1F78";
	case "o/" : return "\u1F79";
	case "u'" : return "\u1F50";
	case "u`" : return "\u1F51";
	case "u'\\" : return "\u1F52";
	case "u`\\" : return "\u1F53";
	case "u'/" : return "\u1F54";
	case "u`/" : return "\u1F55";
	case "u~'" : return "\u1F56";
	case "u~`" : return "\u1F57";
	case "U'" : return "\u1F58";
	case "U`" : return "\u1F59";
	case "U'\\" : return "\u1F5A";
	case "U`\\" : return "\u1F5B";
	case "U'/" : return "\u1F5C";
	case "U`/" : return "\u1F5D";
	case "U~'" : return "\u1F5E";
	case "U~`" : return "\u1F5F";
	case "u\\" : return "\u1F7A";
	case "u/" : return "\u1F7B";
	case "w'" : return "\u1F60";
	case "w`" : return "\u1F61";
	case "w'\\" : return "\u1F62";
	case "w`\\" : return "\u1F63";
	case "w'/" : return "\u1F64";
	case "w`/" : return "\u1F65";
	case "w~'" : return "\u1F66";
	case "w~`" : return "\u1F67";
	case "W'" : return "\u1F68";
	case "W`" : return "\u1F69";
	case "W'\\" : return "\u1F6A";
	case "W`\\" : return "\u1F6B";
	case "W'/" : return "\u1F6C";
	case "W`/" : return "\u1F6D";
	case "W~'" : return "\u1F6E";
	case "W~`" : return "\u1F6F";
	case "w\\" : return "\u1F7C";
	case "w/" : return "\u1F7D";
	case "a'," : return "\u1F80";
	case "a`," : return "\u1F81";
	case "a'\\," : return "\u1F82";
	case "a`\\," : return "\u1F83";
	case "a'/," : return "\u1F84";
	case "a`/," : return "\u1F85";
	case "a~'," : return "\u1F86";
	case "a~`," : return "\u1F87";
	case "A'," : return "\u1F88";
	case "A`," : return "\u1F89";
	case "A'\\," : return "\u1F8A";
	case "A`\\," : return "\u1F8B";
	case "A'/," : return "\u1F8C";
	case "A`/," : return "\u1F8D";
	case "A~'," : return "\u1F8E";
	case "A~`," : return "\u1F8F";
	case "h'," : return "\u1F90";
	case "h`," : return "\u1F91";
	case "h'\\," : return "\u1F92";
	case "h`\\," : return "\u1F93";
	case "h'/," : return "\u1F94";
	case "h`/," : return "\u1F95";
	case "h~'," : return "\u1F96";
	case "h~`," : return "\u1F97";
	case "H'," : return "\u1F98";
	case "H`," : return "\u1F99";
	case "H'\\," : return "\u1F9A";
	case "H`\\," : return "\u1F9B";
	case "H'/," : return "\u1F9C";
	case "H`/," : return "\u1F9D";
	case "H~'," : return "\u1F9E";
	case "H~`," : return "\u1F9F";
	case "w'," : return "\u1FA0";
	case "w`," : return "\u1FA1";
	case "w'\\," : return "\u1FA2";
	case "w`\\," : return "\u1FA3";
	case "w'/," : return "\u1FA4";
	case "w`/," : return "\u1FA5";
	case "w~'," : return "\u1FA6";
	case "w~`," : return "\u1FA7";
	case "W'," : return "\u1FA8";
	case "W`," : return "\u1FA9";
	case "W'\\," : return "\u1FAA";
	case "W`\\," : return "\u1FAB";
	case "W'/," : return "\u1FAC";
	case "W`/," : return "\u1FAD";
	case "W~'," : return "\u1FAE";
	case "W~`," : return "\u1FAF";
	case "au" : return "\u1FB0";
	case "a_" : return "\u1FB1";
	case "a\\," : return "\u1FB2";
	case "a," : return "\u1FB3";
	case "a/," : return "\u1FB4";
	case "a~" : return "\u1FB6";
	case "a~," : return "\u1FB7";
	case "Au" : return "\u1FB8";
	case "A_" : return "\u1FB9";
	case "A\\" : return "\u1FBA";
	case "A/" : return "\u1FBB";
	case "A," : return "\u1FBC";
	case "h\\," : return "\u1FC2";
	case "h," : return "\u1FC3";
	case "h/," : return "\u1FC4";
	case "h~" : return "\u1FC6";
	case "h~," : return "\u1FC7";
	case "H\\" : return "\u1FCA";
	case "H/" : return "\u1FCB";
	case "H," : return "\u1FCC";
	case "iu" : return "\u1FD0";
	case "i_" : return "\u1FD1";
	case 'i\\"' : return "\u1FD2";
	case 'i"\\' : return "\u1FD2";
	case 'i/"' : return "\u1FD3";
	case 'i"/' : return "\u1FD3";
	case "i~" : return "\u1FD6";
	case 'i~"' : return "\u1FD7";
	case "Iu" : return "\u1FD8";
	case "I_" : return "\u1FD9";
	case "I\\" : return "\u1FDA";
	case "I/" : return "\u1FDB";
	case "uu" : return "\u1FE0";
	case "u_" : return "\u1FE1";
	case 'u\\"' : return "\u1FE2";
	case 'u"/' : return "\u1FE3";
	case "u~" : return "\u1FE6";
	case 'u"~' : return "\u1FE7";
	case "Uu" : return "\u1FE8";
	case "U_" : return "\u1FE9";
	case "U`" : return "\u1FEA";
	case "U'" : return "\u1FEB";
	case "r'" : return "\u1FE4";
	case "r`" : return "\u1FE5";
	case "R`" : return "\u1FEC";
	case "w\\," : return "\u1FF2";
	case "w," : return "\u1FF3";
	case "w/," : return "\u1FF4";
	case "w~" : return "\u1FF6";
	case "w~," : return "\u1FF7";
	case "W\\" : return "\u1FFA";
	case "W/" : return "\u1FFB";
	case "W," : return "\u1FFC";
	case "'" : return "\u1FB0";
	case "," : return "\u1FBE";
	case '"~' : return "\u1FC1";
	case "'\\" : return "\u1FCD";
	case "'/" : return "\u1FCE";
	case "~'" : return "\u1FCF";
	case "`\\" : return "\u1FDD";
	case "`/" : return "\u1FDE";
	case "~`" : return "\u1FDF";
	case '"\\' : return "\u1FED";
	case '\\"' : return "\u1FED";
	case '"/' : return "\u1FEE";
	case '/"' : return "\u1FEE";
	case "`" : return "\u1FFE"
	default: exit();
	}
}



function get_input ()
	{
	if ((app.selection.length == 0) || (app.selection[0].constructor.name != 'InsertionPoint'))
		exit();
	var dlg = app.dialogs.add ({name: 'Greek', canCancel: false});
	var response = dlg.dialogColumns.add().textEditboxes.add ({editContents: '?=help', minwidth: 100})
	if (!dlg.show())
		{
		dlg.destroy();
		exit();
		}
	var inp = response.editContents;
	dlg.destroy();
	if (inp == '?=help')
		{
		show_help();
		return get_input ()
		}
	return inp
	}



function show_help()
{
var _radiobuttons;
var dlg = app.dialogs.add ({name:'Help'});
with (dlg.dialogColumns.add())
	{
	with (borderPanels.add())
		{
		with (_radiobuttons = radiobuttonGroups.add())
			{
			radiobuttonControls.add ({staticLabel:'Letters'});
			radiobuttonControls.add ({staticLabel:'Diacritics'});
			radiobuttonControls.add ({staticLabel:'Examples'});
			}
		}
	}
var result = dlg.show()
if ((result == true) && (_radiobuttons.selectedButton > -1))
	{
	switch (_radiobuttons.selectedButton)
		{
		case 0: letters(); break;
		case 1: diacritics(); break;
		case 2: examples(); break;
		}
	}
	else
		dlg.destroy()
}



function letters()
	{
	pr = 'a\talpha \n'
	pr += 'b\tbeta \n'
	pr += 'g\tgamma \n'
	pr += 'd\tdelta \n'
	pr += 'e\tepsilon \n'
	pr += 'z\tzeta \n'
	pr += 'h\teta \n'
	pr += 'th\ttheta \n'
	pr += 'i\tiota \n'
	pr += 'k\tkappa \n'
	pr += 'l\tlambda \n'
	pr += 'n\tnu \n'
	pr += 'x\txi \n'
	pr += 'o\tomicron \n'
	pr += 'p\tpi \n'
	pr += 'r\trho \n'
	pr += 's\tsigma \n'
	pr += '?\tfinal sigma \n'
	pr += 't\ttau \n'
	pr += 'u\tupsilon \n'
	pr += 'ph\tphi \n'
	pr += 'ch\tchi \n'
	pr += 'ps\tpsi \n'
	pr += 'w\tomega \n\n'
	pr += ' (all these are case sensitive)'
	alert (pr, 'Letters')
	}

function diacritics()
	{
	pr = '`\tpsili (lenis, smooth) \n\n'
	pr += "'\tdasia (asper, rough)\n\n"
	pr += '~\tperispomeni \n\n'
	pr += ',\typogegrammeni (iota subscript) \n\n'
	pr += '/\toxia (acute)\n\n'
	pr += '\\\tvaria (grave)\n\n'
	pr += '_\tmacron \n\n'
	pr += '"\tdialytika (dieresis)\n\n'
	alert (pr, 'Diacritics')
	}

function examples()
	{
	pr = 'Enter the letter first, then any diacritics.\n'
	pr += 'If there is more than one diacritic,\n'
	pr += 'type them left to right and top to bottom.\n\n'
	pr += 'Examples:\n\n'
	pr += "\u1F84 is a'/,\n\n"
	pr += "\u1F97 is h~`."
	alert (pr, 'Examples')
	}
