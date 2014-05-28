##### Indesign Files and Folder
==========






****
###### GREP Hints (Snipets which I don't want to memorise!!):
- Useful snipets:
	- `(?<=“).*?(?=“)` --> between " and "
	- `|` --> "Or" Ex: (A|a)nimetro, `[aA]nimetro` works too
	- `[^A]` --> everything except A.
	- `(?i)mim` Case insensitive mim
	- `   ` --> email addresses
	- `mim*` --> Zero or moretime mim!
	- .\r*?  --> All line breakes
- Syntax highlighting in Indesign:
	- PHP:
		- `(?s)  (?<=  \Q  <?php  \E  )  .+?  (?=  \Q  ?>  \E  )` // `(?s)` shortest match, `(?<= something )` where -> before is, `\Q Something \E` escapers for GREP custom characters (So you can put everything inbetween with no worries), `.+?` Wildcard (everything!), `(?= something )` where -> after is.
		- 
	-HTML:
		- `(<\/*p>)|(<\/*strong>)|(<\/*em>)|(<\/*font( color="red")*>)`
	-Javascript:
		- Functions: `(?<=^)function(?=\s)`
		- Function Name: `\b \w* \s* (?= \s*. \(   )`
		- Strings: `.(?<=  "|'  ) .* (?= "|' ).`
		- Operators: `\+  |  \-  |  \=  |  \* |  \/`
		- Comments (SL): `//(?<=//).*`
		- Comments (ML): `\Q/*\E(?<=\Q/*\E) (.*? .\r*?)*?  (?=\Q*/\E) \Q*/\E`


****
###### Indesign scripting:

Usefull resources:

- [Adobe comunity - InDesign Scripting](https://forums.adobe.com/community/indesign/indesign_scripting "InDesign Scripting in Adobe comunity forums")
- [Adobe InDesign CS6 (8.0) Object Model](http://jongware.mit.edu/idcs6js "Adobe InDesign CS6 (8.0) Object Model on MIT servers!")
- [Peter Kahrel's website](http://www.kahrel.plus.com/ "Peter Kahrel")
- [in-tools](http://in-tools.com/)