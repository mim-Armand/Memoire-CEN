// Type phonetic characters
// Peter Kahrel

#target indesign

app.selection[0].contents = combine (get_input ('Phonetic'));

function combine (s)
{
switch (s)
	{
	case 'a' : return '\u0250'		// aturned
	case 'A' : return '\u0251'		// ascript
	case 'AA' : return '\u0252'		// ascript turned
	case 'c' : return '\u0254'		// open o
	case 'C' : return '\u0255'		// curly c
	case 'e' : return '\u0259'		// schwa
	case 'E' : return '\u025B'		// epsilon
	case 'G' : return '\u0261'		// gscript
	case 'g' : return '\u0263'		// gamma
	case 'h' : return '\u0265'		// hturned
	case 'i-' : return '\u0268'		// ibarred
	case 'I' : return '\u026A'		// Ismall
	case 'l3' : return '\u026E'		// lyogh
	case 'flap' : return '\u027E'	// flap
	case 'ng' : return '\u014B'		// eng
	case 'jn' : return '\u0272'		// nlefthookatleft
	case 'm' : return '\u026F'		// turned m
	case 'nj' : return '\u0273'		// nrighthook
	case 'o-' : return '\u0275'		// barred o
	case 'OE' : return '\u0276'		// OEsmall
	case 'r' : return '\u0279'		// r turned
	case 'R' : return '\u0281'		// Rsmall turned
	case 'S' : return '\u0283'		// esh
	case 'u-' : return '\u0289'		// ubarred
	case 'u' : return '\u028A'		// upsilon
	case 'v' : return '\u028C'		// vturned
	case 'w' : return '\u028D'		// wturned
	case 'y' : return '\u028E'		// yturned
	case 'Y' : return '\u028F'		// Y small capital
	case '3' : return '\u0292'		// yogh
	case '?' : return '\u0294'		// glottal stop
	case 'd3' : return '\u02A4'		// d-yogh lig
	case 'ts' : return '\u02A6'		// tslig
	case ':' : return '\u02D0'		// length mark
	case 'syll' : return '\u0329'	// syllabicity mark
	case '7' : return '\u2032'		// prime
	case 'bg' : return '\uF103'		// baby gamma
	case "'" : return '\u02C8'		// stress mark
	case 'hs' : return '\uF158'		// 
	case 'js' : return '\uF159'		// 
	case 'ws' : return '\uF15A'		// 
	default : exit()
	}
}




function get_input (title)
	{
	if ((app.selection.length == 0) || (app.selection[0].constructor.name != 'InsertionPoint'))
		exit();
	var dlg = app.dialogs.add ({name: title, canCancel: false});
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
		return get_input (title)
		}
	return inp
	}



function show_help()
	{
	pr = 'a	0250	(aturned) \n';
	pr += 'A	0251	(ascript) \n';
	pr += 'AA	0252	(ascript turned) \n';
	pr += 'c	0254	(open o) \n';
	pr += 'C	0255	(curly c) \n';
	pr += 'e	0259	(schwa) \n';
	pr += 'E	025B	(epsilon) \n';
	pr += 'G	0261	(gscript) \n';
	pr += 'g	0263	(gamma) \n';
	pr += 'h	0265	(hturned) \n';
	pr += 'i-	0268	(ibarred) \n';
	pr += 'I	026A	(Ismall) \n';
	pr += 'l3	026E	(lyogh) \n';
	pr += 'flap	027E	(flap) \n';
	pr += 'ng	014B	(eng) \n';
	pr += 'jn	0272	(nlefthookatleft) \n';
	pr += 'm	026F	(turned m) \n';
	pr += 'nj	0273	(nrighthook) \n';
	pr += 'o-	0275	(barred o) \n';
	pr += 'OE	0276	(OEsmall) \n';
	pr += 'r	0279	(r turned) \n';
	pr += 'R	0281	(Rsmall turned) \n';
	pr += 'S	0283	(esh) \n';
	pr += 'u-	0289	(ubarred) \n';
	pr += 'u	028A	(upsilon) \n';
	pr += 'v	028C	(vturned) \n';
	pr += 'w	028D	(wturned) \n';
	pr += 'y	028E	(yturned) \n';
	pr += 'Y	028F	(Y small capital) \n';
	pr += '3	0292	(yogh) \n';
	pr += '?	0294	(glottal stop) \n';
	pr += 'd3	02A4	(d-yogh lig) \n';
	pr += 'ts	02A6	(tslig) \n';
	pr += ':	02D0	(length mark) \n';
	pr += 'syll	0329	(syllabicity mark) \n';
	pr += '7	2032	(prime) \n';
	pr += 'bg	F103	(baby gamma) \n';
	pr += "'	02C8	(stress mark) \n";
	alert (pr, 'Phonetic characters')
	}
