var myDocument = app.documents.add();
var myTextFrame = myDocument.pages.item(0).textFrames.add();
myTextFrame.geometricBounds = ["6p", "6p", "24p", "15p"];
myTextFrame.contents = "<b>Hello</b> World !";
alert(app);