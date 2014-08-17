import processing.pdf.*;
 
PGraphics pdf = createGraphics(300, 300, PDF, "output.pdf");
pdf.beginDraw();
pdf.background(128, 0, 0);
pdf.line(50, 50, 250, 250);
((PGraphicsPDF) pdf).nextPage();
pdf.background(0, 128, 0);
pdf.line(50, 250, 250, 50);
pdf.dispose();
pdf.endDraw();
