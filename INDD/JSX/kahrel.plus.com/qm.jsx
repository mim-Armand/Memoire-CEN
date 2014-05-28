//DESCRIPTION: Set or find a quickmark
//Peter Kahrel

if ( valid_selection () )
	{
	doc = app.activeDocument;
	dlg = app.dialogs.add ( { name:'Quickmark' } );
	qm = dlg.dialogColumns.add().textEditboxes.add  ( { editContents : 'f' } );
	if( !dlg.show() )
		{ dlg.destroy(); exit(); }
	response = qm.editContents.toLowerCase();
	dlg.destroy();
	switch( response )
		{
		case 's' : case 'q' : quickmark_set(); break;
		case 'f' : quickmark_find();
		}
	}
else
	{
	alert ( 'Not a valid selection.' )
	exit ()
	}
//end


function quickmark_set()
{
if( doc.bookmarks.item('quickmark') != null )
	{
	doc.bookmarks.item( 'quickmark' ).remove();
	doc.hyperlinkTextDestinations.item( 'quickmark' ).remove();
	}
doc.bookmarks.add( 
	doc.hyperlinkTextDestinations.add( app.selection[0], { name: 'quickmark' } ),
	{ name : 'quickmark' } );
}


function quickmark_find()
{
if( doc.bookmarks.item('quickmark') != null )
	app.activeDocument.bookmarks.item( 'quickmark' ).showBookmark()
else
	alert( 'No quickmarks here' );
}


function valid_selection ()
{
return (app.selection.length > 0) &&
	( 'Text|Character|Word|Paragraph|InsertionPoint'.indexOf( 
		app.selection[0].constructor.name ) > 0 )
}
