
/*
 * This sketch uses the text drawn to an offscreen PGraphics to determine
 * if coordinate are inside the drawn text. In addition, the sketch has
 * no background call in draw(), so the drawings will accumulate on top
 * of each other much like a painting's canvas. Last but not least, the
 * sketch has a number of Particles that move around the canvas leaving
 * a visible trail (since there is no background call).
 * 
 * USAGE:
 * - click the mouse to cycle through the four different drawing modes
 */

int maxParticles = 10; // the maximum number of active particles
ArrayList <Particle> particles = new ArrayList <Particle> (); // the list of particles
int drawMode = 0; // cycle through the drawing modes by clicking the mouse
color BACKGROUND_COLOR = color(255);
color PGRAPHICS_COLOR = color(255,0,0);
PGraphics pg;

void setup() {
  size(800, 600, P3D);
  smooth(16); // higher smooth setting = higher quality rendering
  // create the offscreen PGraphics with the text 
  pg = createGraphics(width, height, JAVA2D);
  pg.beginDraw();
  pg.textSize(222);
  pg.textAlign(CENTER, CENTER);
  pg.fill(PGRAPHICS_COLOR);
  pg.text("MERCi!", pg.width/2, pg.height/2); 
  pg.endDraw();
  background(BACKGROUND_COLOR);
}

void draw() {
  addRemoveParticles();
  // update and display each particle in the list
  for (Particle p : particles) {
    p.update();
    p.display();
  }
}

void mousePressed() {
  drawMode = ++drawMode%4; // cycle through 4 drawing modes (0, 1, 2, 3)
  background(BACKGROUND_COLOR); // clear the screen
  if (drawMode == 2) image(pg, 0, 0); // draw text to the screen for drawMode 2
  particles.clear(); // remove all particles
}

void addRemoveParticles() {
  if (drawMode >= 1) {
    // remove particles with no life left
    for (int i=particles.size()-1; i>=0; i--) {
      Particle p = particles.get(i);
      if (p.life <= 0) {
        particles.remove(i);
      }
    }
  }
  // add particles until the maximum
  while (particles.size () < maxParticles) {
    particles.add(new Particle());
  }
}
