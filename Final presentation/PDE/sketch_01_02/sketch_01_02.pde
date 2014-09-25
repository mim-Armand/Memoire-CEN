int maxParticles = 15; // the maximum number of active particles //<>//
ArrayList <Particle> particles = new ArrayList <Particle> (); // the list of particles
int drawMode = 2; // cycle through the drawing modes by clicking the mouse
color BACKGROUND_COLOR = color(255);
color PGRAPHICS_COLOR = color(255);
color PARTICLE_COLOR = color(0, 125);
color PARTICLE_COLOR_FILL = color(255,33);
PGraphics pg;
boolean remerciment = false;




boolean isFullscreen = true;
boolean timer = true;
boolean showHud = true;
boolean showGrid = true;
boolean showMous = true;
boolean console = false;
boolean nextOrPrevious = true; // true: next, false: previous
int currentPage = 0;
PImage photo;
PGraphics bg1, fg1, hud, mouseLayer, dummy;
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
  
  //============================ REMOVE ====================================
  showGrid = showMous = false;
  currentPage = 6;
  //========================================================================
  
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
  mouseLayer = createGraphics(w, h);
  dummy = createGraphics(w, h);
  size(w, h, P3D);
  if (frame != null) {
    frame.setResizable(true);
  }
  smooth();
  background(255);
  imageMode(CENTER);
  
  
  pg = createGraphics(width, height, JAVA2D);
  pg.beginDraw();
  pg.textSize(180);
  pg.textAlign(CENTER, CENTER);
  pg.fill(PGRAPHICS_COLOR);
  pg.text("MERCi!", pg.width/2, pg.height/2);
  pg.textSize(30);
  pg.text("mim,", pg.width/2 , pg.height/2 +120);
  pg.endDraw();
  background(BACKGROUND_COLOR);

  
}

void draw() {
  if(!remerciment) background(255);
  if (!isErased) {
    eraser();
  } else {
    switch(currentPage) {
    case 0:
      fg1.beginDraw();
      fg1.clear();
      fg1.endDraw();
      break;
    case 1:
      p1();
      break;
    case 2:
      p2();
      break;
    case 3:
      p3();
      break;
    case 4:
      p4();
      break;
    case 5:
      p5();
      break;
    case 6:
      remerciment = true;
      break;
    }
  }
  render(/* wiggle foregrand 1 , background 1: */1.2, 0);
  if(remerciment){
    addRemoveParticles();
    
  // update and display each particle in the list
  dummy.beginDraw();
  for (Particle p : particles) {
    p.update();
    p.display();
  }
  dummy.endDraw();
  image(dummy, pg.width/2, pg.height/2);
  image(pg, pg.width/2, pg.height/2);
  
  

  
  
  }
}








int cycles = 0;
int sessionCycles = 0;
boolean randomColor = false;
void addRemoveParticles() {
  if (drawMode >= 1) {
    // remove particles with no life left
    for (int i=particles.size()-1; i>=0; i--) {
      Particle p = particles.get(i);
      if (p.life <= 0) {
        cycles++;
        if(cycles > 120){
          randomColor = !randomColor;
          background(255);
          cycles = 0;
          sessionCycles++;
        }
        particles.remove(i);
      }
    }
  }
  // add particles until the maximum
  while (particles.size () < maxParticles) {
    particles.add(new Particle());
  }
}


void p5() {
transition_2(bg1);
if(p3sub > 13){
  p3sub = 13;
}
  if (!bool) {
    photo = loadImage("5_" + p3sub + ".png");
    fg1.beginDraw();
    fg1.clear();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc, hc );
    fg1.endDraw();
    bool = true;
  }
}


PGraphics transition_2(PGraphics l){
  tempfloat1 = random(24);
  tempfloat2 = random(24);
  if( transition_temp_1 * 5 > h || transition_temp_1 < 0){
    tempint = (tempint) * -1;
  }
  transition_temp_1 += tempint;
  l.stroke(random(0, 33));
  l.strokeWeight(random(24));
  l.strokeCap(SQUARE);
  l.fill(random(15));
  l.beginDraw();
  l.line( random(66) , transition_temp_1*5 + tempfloat1 , w-random(66) , transition_temp_1*5 + tempfloat2);
  l.endDraw();
  return l;
}

void p4() {
transition_1(bg1);
if(p3sub > 22){
  p3sub = 22;
}
  if (!bool) {
    photo = loadImage("4_" + p3sub + ".png");
    fg1.beginDraw();
    fg1.clear();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc, hc );
    fg1.endDraw();
    bool = true;
  }
}


int transition_temp_1 = 0;
float tempfloat1 = 0;
float tempfloat2 = 0;
int tempint = 1;
PGraphics transition_1(PGraphics l){
  tempfloat1 = random(24);
  tempfloat2 = random(24);
  if( transition_temp_1 * 5 > w || transition_temp_1 < 0){
    tempint = (tempint) * -1;
  }
  transition_temp_1 += tempint;
  l.stroke(random(0, 33));
  l.strokeWeight(random(24));
  l.strokeCap(SQUARE);
  l.fill(random(15));
  l.beginDraw();
  l.line( transition_temp_1*5 + tempfloat1 , random(66) , transition_temp_1*5 + tempfloat2 , h-random(66) );
  l.endDraw();
  return l;
}


int p3sub = 1;
void p3() {
p1bg(bg1);
if(p3sub > 8){
  p3sub = 8;
}
  if (!bool) {
    photo = loadImage("3_" + p3sub + ".png");
    fg1.beginDraw();
    fg1.clear();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc, hc );
    fg1.endDraw();
    bool = true;
  }
}

void p2() {
p1bg(bg1);
  if (!bool) {
    photo = loadImage("2.png");
    fg1.beginDraw();
    fg1.imageMode(CENTER);
    fg1.image(photo, wc, hc );
    fg1.endDraw();
    bool = true;
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
}

PGraphics p1bg (PGraphics l){
  l.stroke(random(0, 33));
  l.strokeWeight(random(15));
  l.strokeCap(SQUARE);
  l.fill(random(15));
  l.beginDraw();
  l.line(random(width), random(height), random(width), random(height));
  l.rect(random(width - 150), random(height - 150), random(150), random(150));
  l.endDraw();
  return l;
}

PGraphics khat( PGraphics l, boolean isRandomGray) {
  if (isRandomGray) {
    l.stroke(random(0, 45));
  }
  l.beginDraw();
  l.strokeWeight(random(15));
  l.strokeCap(SQUARE);
  l.line(random(width), random(height), random(width), random(height));
  l.line(random(width), random(height), random(width), random(height));
  l.endDraw();
  return l;
}
