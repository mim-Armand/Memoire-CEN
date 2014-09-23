int currentPage = 0;
PImage photo;
PGraphics bg1, fg1;
int w, h, wc, hc, strk1;
boolean bool = false; 
boolean sketchFullScreen() {
  return true;
}
float fg_rx = 0;
float fg_ry = 0;
float bg_rx = 0;
float bg_ry = 0;

void setup(){
  strk1 = 6;
  w = displayWidth;
  h = displayHeight;
  wc = round(w/2);
  hc = round(h/2);
  bg1 = createGraphics(w, h);
  fg1 = createGraphics(w, h);
  size(w, h);
  if (frame != null) {
    frame.setResizable(true);
  }
  smooth();
  background(255);
  imageMode(CENTER);
  
}

void draw(){
  background(255);
  switch(currentPage){
    case 0: p1();
    break;
    case 1:
    break;
  }
}
void render( float wiggle_fg, float wiggle_bg ){
  
  if (wiggle_fg != 0) {
    fg_rx = random(-wiggle_fg, wiggle_fg);
    fg_ry = random(-wiggle_fg, wiggle_fg);
  };
  if (wiggle_bg != 0) {
    bg_rx = random(-wiggle_bg, wiggle_bg);
    bg_ry = random(-wiggle_bg, wiggle_bg);
  };

  image(bg1, wc + bg_rx, hc + bg_ry);
  image(fg1, wc + fg_rx, hc + fg_ry);
  
  println(round(frameRate));
}

void p1(){
  
  khat(bg1);
  if(!bool){
    photo = loadImage("1.png");
    fg1.beginDraw();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc , hc );
    fg1.endDraw();
    bool = true;
  }
  render(/* wiggle foregrand 1 , background 1: */0 , 0);
  
}

PGraphics khat( PGraphics l){
  l.beginDraw();
  l.strokeWeight(random(15));
  l.strokeCap(SQUARE);
  l.line(random(width), random(height), random(width), random(height));
  l.endDraw();
  return l;
}


void mousePressed() {
  println("mouse key code: " + mouseButton );
}

void keyPressed() {
  println("key code: "+keyCode);
}
