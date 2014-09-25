int ms, se, mn, fps;
int overTime = 0;
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
  hud.line(0, 21, (mn)*6.6 - overTime, 21);
  hud.fill(0);
  hud.textSize(11);
  timeTxt = mn + " : " + se + " : " + ms;
  hud.text(timeTxt, 6, 36);
  hud.noStroke();
  hud.textSize(15);
  if (mn >= 15) {
    overTime = 12;
    hud.fill(255, 0, 0);
    hud.rect(0, 39, 100, 20);
    hud.fill(255);
    timeStatus = "Time Over !";
    hud.text(timeStatus, 6, 54);
  }else if(mn > 7){
    hud.fill(180, 180, 0);
    hud.rect(0, 39, 100, 20);
    hud.fill(255);
    timeStatus = "Time > Half!";
    if(mn > 13){
      timeStatus = "HURRRRY!!!";
    }
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
  // current page:
  hud.fill(180, 180);
  hud.noStroke();
  hud.rect(0,85,100,15);
  hud.fill(0,0,255);
  hud.text("current page: "+currentPage, 3, 96);
  // grids:
  hud.fill(255,0,0);
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




int mosX, mosY;
void drawMouse(){
  ellipseMode(CENTER);
  mosX = mouseX;
  mosY = mouseY;
  mouseLayer.clear();
  mouseLayer.strokeWeight(1);
  mouseLayer.stroke(0,255,0);
  mouseLayer.noFill();
  mouseLayer.beginDraw();
  mouseLayer.line(mosX,0,mosX,h);
  mouseLayer.line(0, mosY, w, mosY);
  mouseLayer.stroke(0,120);
  mouseLayer.strokeWeight(12);
  mouseLayer.ellipse(mosX, mosY, 66, 66);
  mouseLayer.stroke(0,255,0);
  mouseLayer.strokeWeight(6);
  mouseLayer.ellipse(mosX, mosY, 66, 66);
  mouseLayer.strokeWeight(12);
  mouseLayer.line(mosX, 30, mosX, 66);
  mouseLayer.line(mosX, h-66, mosX, h-30);
  mouseLayer.line(30, mosY, 66, mosY);
  mouseLayer.line(w-66, mosY, w-30, mosY);
  mouseLayer.fill(255,0,0);
  mouseLayer.textSize(12);
  mouseLayer.text("x: " + mosX , mosX - 72 , mosY - 66);
  mouseLayer.text("y: " + mosY , mosX - 72 , mosY - 51);
  mouseLayer.endDraw();
}
