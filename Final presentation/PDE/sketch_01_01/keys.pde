void mousePressed() {
  println("mouse key code: " + mouseButton );
}

void keyPressed() {
  switch(keyCode) {
  case 39: // right arrow
  remerciment = false;
  bool = false;
  isErased = false;
  nextOrPrevious = true;
  p3sub = 1;
  transition_temp_1 = 0;
  eraser();
  break;
  case 37: // left arrow
  remerciment = false;
  bool = false;
  isErased = false;
  nextOrPrevious = false;
  p3sub = 1;
  transition_temp_1 = 0;
  eraser();
  break;
  case 46:
    bool = false;
    p3sub++;
  break;
  case 44:
    bool = false;
    if(p3sub>1){
    p3sub--;}
  break;
  case 32:
    showHud = !showHud;
    break;
  case 67:
    console = !console;
    break;
  case 71:
    showGrid = !showGrid;
    break;
  case 77:
  showMous = !showMous;
  if(showMous){
    noCursor();
  }else{
    cursor(CROSS);
  }
    println("mouse on");
    break;
  default:
    println("key code: "+keyCode);
    break;
  }
}
