import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class sketch_0001_05 extends PApplet {

int width = 800; int height = 450;
PImage img;
Animation car, mikh;
float car_y=150;
float road_width = height/4;
int mikhSpeed, mikhSpeed2 = 0;
int mikhRrndmzer, mikhRrndmzer2 = 1;
int preRecord;
int bestRecord = 0;

public void setup(){
  size(width,height); frameRate(12);
  car = new Animation("car_01_",15,"png");
  mikh  = new Animation("meekh_",11,"png");
  textSize(18);
}
public void draw(){
  background(111,0,0);
  text("Previous record: " + preRecord,210,60);
  text("Best Record: "+bestRecord, 450,60);
  text("Your Score: "+PApplet.parseInt(frameRate),18,60);
  drawAsphalt();
  if (mikhSpeed>width+10){mikhSpeed-=width;mikhRrndmzer=PApplet.parseInt(random(4));}else{mikhSpeed+=12;}
  mikh.anim_render(width-mikhSpeed,(1+mikhRrndmzer)*road_width+60, true);
   if (mikhSpeed2>width+10){mikhSpeed2-=width;mikhRrndmzer2=PApplet.parseInt(random(4));}else{mikhSpeed2+=12;}
  mikh.anim_render(width-mikhSpeed2,(1+mikhRrndmzer2)*road_width+60, true);
  car.anim_render(30,car_y, false);
}
public void collisionCheck(){
}
public void mousePressed() {
  if (mouseY < 220 ) { car_y =30;}
  else if (mouseY < 333 && mouseY > 220) { car_y =150; }
  else { car_y = 255; }
}
/*float pointer_y;
  void pointerMove(TouchEvent e){
    replace the above function by this one in MVS
   pointer_y = e.offsetY ;
  }*/
class Animation{
  PImage[] images;
  int imageCount;
  int frame;
  Animation(String imagePrefix, int count, String imageFormat) {
    imageCount = count;
    images = new PImage[imageCount];
    for (int i=0; i<imageCount; i++){
      String filename =  "/Assets/"+imagePrefix + nf(i,2) + "." + imageFormat;
      images[i] = loadImage(filename);
    }
  }
  public void anim_render(float _x, float _y, boolean i){
    frame = (frame+1) % imageCount;
    image(images[frame],_x,_y);
    if(i) { 
      if(_x < 250 && _x > 0 && _y < (car_y+150) && _y > (car_y + 50)){
        textSize(99);
        text("OH!",width/2,height/2-21);
        textSize(18);
        preRecord = PApplet.parseInt(frameRate);
        if(bestRecord<preRecord){bestRecord=PApplet.parseInt(frameRate);}
        frameRate=12;
        mikhSpeed-=width;
        mikhRrndmzer=PApplet.parseInt(random(4));
        mikhRrndmzer2=PApplet.parseInt(random(4));
      }else{frameRate(frameRate+=.1f);}
    }
  }
   //int getCarWidth() {
   // return images[0].width;
  //}
}
public void drawAsphalt(){
  stroke(111);
  strokeWeight(6);
  line(0,road_width,width,road_width);
  line(0,road_width*2,width,road_width*2);
  line(0,road_width*3,width,road_width*3);
  line(0,road_width*4,width,road_width*4);
}

  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "--full-screen", "--bgcolor=#666666", "--stop-color=#cccccc", "sketch_0001_05" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
