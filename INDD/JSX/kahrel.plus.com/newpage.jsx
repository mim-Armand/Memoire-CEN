// DESCRIPTION: Add a page while typing
// Peter Kahrel

// add a page at the end of the current document,
// place a text frame on it, and link the text frame

doc = app.activeDocument;
np = doc.pages.add();
marg = np.marginPreferences;
gb = [marg.top, marg.left, 
	doc.documentPreferences.pageHeight - marg.bottom, 
	doc.documentPreferences.pageWidth - marg.right];
oldRuler = doc.viewPreferences.rulerOrigin;
doc.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;
with (doc.pages[-1].textFrames.add())
	{
	geometricBounds = gb;
	previousTextFrame = doc.pages[-2].textFrames[0];
	}
doc.viewPreferences.rulerOrigin = oldRuler;