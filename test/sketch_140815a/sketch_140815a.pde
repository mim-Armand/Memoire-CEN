import processing.pdf.*;

void setup() {
  size(666, 666);

  /*beginRecord(PDF, "test.pdf");
   background(102);
   s1(80, 100, 60);
   s2(80, 100, 60);
   endRecord();*/
  pageNumber(1, 2, 3, 4);
}

void draw() {
}
void pageNumber(int currentPage, int allPages, float r1, float r2) {
  PGraphics pdf = createGraphics(300, 300, PDF, "t.pdf");
  PGraphicsPDF pdfg = (PGraphicsPDF) pdf;  // Get the renderer
  pdfg.beginDraw();


  for (int i = 0 ; i < allPages ; i++) { 
    // Tell it to go to the next page
    pdf.background(0, 111, 0);
    pdf.line(i, 50, 250, 250);
    pdfg.nextPage();
  }
  pdf.dispose();
  pdf.endDraw();
}

void s1(float radius1, float radius2, int npoints) {
  int x = int(width/2);
  int y = int(height/2);
  float angle = TWO_PI / npoints;
  float halfAngle = angle/2;

  for (float a = 0; a < TWO_PI; a += angle) {
    beginShape();
    fill(0, 255, 0);
    float sx = x + cos(a) * radius1;
    float sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);

    float sx2 = x + cos(a+halfAngle) * radius2;
    float sy2 = y + sin(a+halfAngle) * radius2;
    vertex(sx2, sy2);
    sx2 = x + cos(a) * radius2;
    sy2 = y + sin(a) * radius2;
    vertex(sx2, sy2);
    endShape(CLOSE);
  }
}


void s2(float radius1, float radius2, int npoints) {
  int x = int(width/2);
  int y = int(height/2);
  float angle = TWO_PI / npoints;
  float halfAngle = angle/2;

  for (float a = 0; a < PI; a += angle) {
    beginShape();
    fill(255, 0, 0);
    float sx = x + cos(a) * radius1;
    float sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);

    float sx2 = x + cos(a+halfAngle) * radius2;
    float sy2 = y + sin(a+halfAngle) * radius2;
    vertex(sx2, sy2);
    sx2 = x + cos(a) * radius2;
    sy2 = y + sin(a) * radius2;
    vertex(sx2, sy2);
    endShape(CLOSE);
  }
}

