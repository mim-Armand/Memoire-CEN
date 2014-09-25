
class Particle {
  PVector loc, vel; // location and velocity
  float radius = 15; // base radius of the ellipse
  float life = 3; // start with a full life
  float lifeRate = 0.0081; // decrease rate of life

  Particle() {
    getPosition();
    vel = PVector.random2D(); // random direction
  }

  // get a random position inside the text
  void getPosition() {
    while (loc == null || !isInText(loc)) loc = new PVector(random(width), random(height));
  }

  void update() {
    vel.rotate(random(-QUARTER_PI, QUARTER_PI)); // rotate velocity (direction of movement)
    loc.add(vel); // add velocity to position (aka move!)
    switch(drawMode) {
      case 0: 
        if (!isInText(loc)) getPosition(); // once the particle is outside the text, randomly place it somewhere inside the text
        break;
      case 1: 
      case 2: 
        life -= lifeRate; // decrease life by the lifeRate (the particle is removed by the addRemoveParticles() method when no life is left)
        break;
      case 3: 
        // combine the behaviors of case 0 (keep particle inside text) and 1 (decrease life, remove particle)
        if (!isInText(loc)) getPosition();
        life -= lifeRate;
        break;
    }
  }

  void display() {
    if(randomColor){
      PARTICLE_COLOR = color(random(255), random(255), random(255), random(255));
      // PARTICLE_COLOR_FILL = color(random(255), random(255), random(255), random(255));
      PARTICLE_COLOR_FILL = color(0,0);
    }else{
      PARTICLE_COLOR = color(0, 125);
      PARTICLE_COLOR_FILL = color(255,33);
    }
    fill(PARTICLE_COLOR_FILL); // white fill
    stroke(PARTICLE_COLOR); // transparant black stroke
    float r = radius; // radius of the ellipse
    switch(drawMode) {
      case 0: break; // don't change radius
      case 1: // go to 3
      case 2: // go to 3
      case 3: r *= life; break; // base the radius of the ellipse on the life (which decreases from 1 to 0)
    }
    ellipse(loc.x, loc.y, r, r); // draw ellipse
    image(pg, pg.width/2, pg.height/2);
  }

  // return if point is inside the text
  boolean isInText(PVector v) {
    return pg.get(int(v.x), int(v.y)) == PGRAPHICS_COLOR;
  }
}
