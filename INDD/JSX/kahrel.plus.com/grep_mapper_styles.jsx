//DESCRIPTION: Create GREP styles
// Peter Kahrel 2009 -- www.kahrel.plus.com

#target indesign;

if (parseInt (app.version) < 6)
	errorM ('This script is for CS4 and later.');

if (app.documents.length == 0)
	app.documents.add ();

grep_setup ();

function grep_setup ()
	{
	// create a highlight colour
	var colour = unicolour ('unicode');
	// create a character style for the GREP styles
	var cstyle = charstyle ('unicode', colour);
	// remove any existing styles
	delete_styles ();
	pstyle_unicode (init_unicode(), cstyle);
	pstyle ('GREP', "", ['\\w','\\W','\\u','\\U','\\l','\\L','\\d','\\D','\\s','\\S'], "", cstyle);
	pstyle ('POSIX', '[[:', ['alnum','alpha','blank','cntrl','digit','graph','lower','print',
			'punct','space','upper','xdigit'], ':]]', cstyle);
	}



function pstyle_unicode (array, cstyle)
	{
	var top_root = app.activeDocument.paragraphStyleGroups.add ({name: 'Unicode'});
	for (var i = 0; i < array.length; i++)
		{
		// delete the abbreviated form for the groups, they don't work anyway
		var root = top_root.paragraphStyleGroups.add ({name: array[i][0].replace (/\x20.+$/, "")})
		for (j = 0; j < array[i].length; j++)
			{
			try
				{
				var ps = root.paragraphStyles.add ({name: array[i][j]});
				ps.basedOn = app.activeDocument.paragraphStyles[1];
				var gr_expression = array[i][j].replace (/\x20.+$/, "");
				x = ps.nestedGrepStyles.add (
					{appliedCharacterStyle: cstyle, grepExpression: '^....\\t' + gr_expression})
				}
			catch (_){}
			}
		}
	}

function pstyle (stylename, prefix, array, suffix, cstyle)
	{
	var root = app.activeDocument.paragraphStyleGroups.add ({name: stylename});
	for (var i = 0; i < array.length; i++)
		{
		try
			{
			var ps = root.paragraphStyles.add ({name: array[i]});
			ps.basedOn = app.activeDocument.paragraphStyles[1];
			x = ps.nestedGrepStyles.add (
				{appliedCharacterStyle: cstyle, grepExpression: '^....\\t' + prefix + array[i] + suffix})
			}
		catch (_){}
		}
	}

function charstyle (n, colour)
	{
	if (app.activeDocument.characterStyles.item (n) == null)
		app.activeDocument.characterStyles.add ({name: n, fillColor: colour});
	return app.activeDocument.characterStyles.item (n)
	}
		

function unicolour (n)
	{
	if (app.activeDocument.swatches.item (n) == null)
		app.activeDocument.colors.add ({name: n, space: ColorSpace.cmyk, colorValue: [100,0,0,0]});
	return app.activeDocument.swatches.item (n)
	}


function delete_styles ()
	{
	app.activeDocument.paragraphStyleGroups.everyItem().remove();
	var ps = app.activeDocument.paragraphStyles.everyItem().getElements();
	for (var i = ps.length-1; i > 1; i--)
		ps[i].remove()
	}

function errorM (m)
	{
	alert (m);
	exit ()
	}


function init_unicode ()
	{
	return [
		['\\p{Letter}   \\p{L}',
		'\\p{Lowercase_letter}   \\p{Ll}',
		'\\p{Uppercase_letter}   \\p{Lu}',
		'\\p{Titlecase_letter}   \\p{Lt}',
		'\\p{Modifier_letter}   \\p{Lm}',
		'\\p{Letter_other}   \\p{Lo}'],
		['\\p{Mark}   \\p{M}',
		'\\p{Non_spacing_mark}   \\p{Mn}',
		'\\p{Spacing_combining_mark}   \\p{Mc}',
		'\\p{Enclosing_mark}   \\p{Me}'],
		['\\p{Separator}   \\p{S}',
		'\\p{Space_separator}   \\p{Zs}',
		'\\p{Line_separator}   \\p{Zl}',
		'\\p{Paragraph_separator}   \\p{Zp}'],
		['\\p{Symbol}   \\p{-}',
		'\\p{Math_symbol}   \\p{Sm}',
		'\\p{Currency_symbol}   \\p{Sc}',
		'\\p{Modifier_symbol}   \\p{Sk}',
		'\\p{Other_symbol}   \\p{So}'],
		['\\p{Number}   \\p{N}',
		'\\p{Decimal_digit_number}   \\p{Nd}',
		'\\p{Letter_number}   \\p{Nl}',
		'\\p{Other_number}   \\p{No}'],
		['\\p{Punctuation}   \\p{P}',
		'\\p{Dash_punctuation}   \\p{Pd}',
		'\\p{Open_punctuation}   \\p{Ps}',
		'\\p{Close_punctuation}   \\p{Pe}',
		'\\p{Initial_punctuation}   \\p{Pi}',
		'\\p{Final_punctuation}   \\p{Pf}',
		'\\p{Connector_punctuation}   \\p{Pc}'],
		'\\p{Other_punctuation}   \\p{Po}',
		['\\p{Other}   \\p{C}',
		'\\p{Control}   \\p{Cc}',
		'\\p{Format}   \\p{Cf}',
		'\\p{Private_use}   \\p{Co}',
		'\\p{Unassigned}   \\p{Cn}']
		]
		}