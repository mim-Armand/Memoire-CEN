boolean isFullscreen = true; //<>//
boolean timer = true;
boolean showHud = true;
boolean showGrid = true;
boolean console = true;
int currentPage = 0;
PImage photo;
PGraphics bg1, fg1, hud;
int w, h, wc, hc, strk1;
boolean bool = false;
float fg_rx = 0;
float fg_ry = 0;
float bg_rx = 0;
float bg_ry = 0;
boolean sketchFullScreen() {
  return isFullscreen;
}

void setup() {
  strk1 = 6;
  w = 800;
  h = 600;
  w = displayWidth;
  h = displayHeight;
  wc = round(w/2);
  hc = round(h/2);
  bg1 = createGraphics(w, h);
  fg1 = createGraphics(w, h);
  hud = createGraphics(w, h);
  size(w, h, P3D);
  frameRate(666);
  if (frame != null) {
    frame.setResizable(true);
  }
  smooth();
  background(255);
  imageMode(CENTER);
}

void draw() {
  background(255);
  switch(currentPage) {
  case 0: 
    p1();
    break;
  case 1:
    break;
  }
}
void render( float wiggle_fg, float wiggle_bg ) {
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
  if (showHud) {
    drawHud();
    image(hud, wc, hc);
  }
  if (console) {
    println(timeTxt);
    println(round(frameRate) + " fps.");
  }
}

void p1() {
  khat(bg1, true);
  if (!bool) {
    photo = loadImage("1.png");
    fg1.beginDraw();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc, hc );
    fg1.endDraw();
    bool = true;
  }
  render(/* wiggle foregrand 1 , background 1: */1, 0);
}

int ms, se, mn, fps;
String timeTxt;
String timeStatus = "Time: OK!";
void drawHud() {
  ms = millis();
  se = round(ms/1000);
  mn = round(se/60);
  hud.clear();
  hud.strokeCap(SQUARE);
  hud.beginDraw();
  hud.strokeWeight(1);
  hud.fill(255, 210);
  hud.noStroke();
  hud.rect(0, 0, 100, 39);
  hud.strokeWeight(6);
  hud.stroke(255, 150, 0);
  hud.line(0, 5, (ms - (se*1000))/9.9, 5);
  hud.stroke(255, 75, 0);
  hud.line(0, 13, (se - (mn*60))*1.6, 13);
  hud.stroke(180);
  hud.line(0, 21, 100, 21);
  hud.stroke(255, 0, 0);
  hud.line(0, 21, (mn)*6.6, 21);
  hud.fill(0);
  hud.textSize(11);
  timeTxt = mn + " : " + se + " : " + ms;
  hud.text(timeTxt, 6, 36);
  hud.noStroke();
  hud.textSize(15);
  if (mn >= 16) {
    hud.fill(255, 0, 0);
    hud.rect(0, 39, 100, 20);
    hud.fill(255);
    timeStatus = "Time Over !";
    hud.text(timeStatus, 6, 54);
  } else {
    hud.fill(120, 255, 0);
    hud.rect(0, 39, 100, 20);
    hud.fill(0);
    hud.text(timeStatus, 6, 54);
  }
  fps = round(frameRate);
  hud.fill(66,180);
  hud.rect(0, 59, 100, 11);
  hud.stroke( 360-fps*4.5, fps*4.5, 0 );
  hud.line(0, 64, fps*1.6, 64);
  hud.fill(255, 210);
  hud.noStroke();
  hud.rect(0, 70, 100, 15);
  hud.fill(255,0,0);
  hud.textSize(11);
  hud.text("Framerate "+fps + " fps.", 3, 81);
  if(showGrid){
    hud.noFill();
    hud.stroke(255,0,0);
    hud.strokeWeight(1);
    hud.rect(0,0,480,320);
    hud.text("480 x 320", 480, 320);
    hud.rect(0,0,640,480);
    hud.text("640 x 480", 640, 480);
    hud.rect(0,0,800,600);
    hud.text("800 x 600", 800, 600);
    hud.rect(0,0,1024,768);
    hud.text("1024 x 768", 1024, 768);
    hud.strokeWeight(.2);
    hud.textSize(9);
    hud.fill(33);
    for( int i = w; i > 0; i -= 50){
      hud.line(i, 0 , i , h);
      hud.text(i,i+2, h-20);
    }
    for( int i = h; i > 0; i -= 50){
      hud.line(0, i , w , i);
      hud.text(i,w-50, i);
    }
  }
  hud.endDraw();
}

PGraphics khat( PGraphics l, boolean isRandomGray) {
  if (isRandomGray) {
    l.stroke(random(0, 45));
  }
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
  switch(keyCode) {
  case 32:
    showHud = !showHud;
    break;
  case 67:
    console = !console;
    break;
  case 71:
    showGrid = !showGrid;
    break;
  default:
    println("key code: "+keyCode);
    break;
  }
}
