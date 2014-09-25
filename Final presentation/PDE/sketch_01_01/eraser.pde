boolean isErased = true;
int eraserCounter = 0;
void eraser() {
  // p3sub = 1;
  eraserCounter+=6;
  fg1.beginDraw();
  fg1.fill(255, eraserCounter);
  fg1.rect(0, 0, w, h);
  fg1.endDraw();
  if (eraserCounter > 255) {
    isErased = true;
    fg1.beginDraw();
    fg1.clear();
    fg1.endDraw();
    bg1.beginDraw();
    bg1.clear();
    bg1.endDraw();
    eraserCounter = 0;
  }
  if (isErased) {
    if (nextOrPrevious) {
      if( currentPage < 6) currentPage++;
    } else {
      if( currentPage > 0) currentPage--;
    }
  }
}
