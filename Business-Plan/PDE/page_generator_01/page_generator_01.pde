Points mover;
int docWidth, docHeight;
int dpi = 300; //TODO!
float scaleFactor = 4.2;
int arrayLength = 66;
int bgLength = 333;
float minDistance, maxDistance, lineWeightMin, lineWeightMax, circleSizeMin, circleSizeMax;
Points[] myArray = new Points[(arrayLength + 3 + 3 + 3 + 3 + bgLength)];
PGraphics imageHolder;
void setup() {
  docWidth = 842*2;
  docHeight = 298;
  minDistance = 27;
  maxDistance = 33;
  lineWeightMin = 1;
  lineWeightMax = 3;
  circleSizeMin = 3;
  circleSizeMax = 15;
//  size(int(scaleFactor * docWidth), int(scaleFactor * docHeight));
  imageHolder = createGraphics(int(scaleFactor * docWidth), int(scaleFactor * docHeight));
  for (int i = 0; i< arrayLength + bgLength + 12; i++) {
    myArray[i] = new Points();
  }
  
}
void draw() {
}
int fileName = 0;
void keyPressed() {
  if (key == 's') {
    fileName ++;
    imageHolder.save(fileName + ".png");
  } else {
    for (int i = 0; i< arrayLength; i++) {
      myArray[bgLength + i].update();
    }
    for (int i = 0; i < 3; i++) {
      myArray[bgLength + arrayLength + i].update(new PVector(
      random((scaleFactor*docWidth/4) - (scaleFactor*150) , (scaleFactor*150) + (scaleFactor*docWidth/4)) ,//location (vector) - X
      random(scaleFactor*(docHeight/9)*7 , scaleFactor*(docHeight/9)*8.5)),//location (vector) - Y
      random((docWidth/8/2)/9 , (docWidth/8/2)/5),//circleSize
      docWidth/42, //gravity
      docWidth/600,//lineWeight
      color(0,0,0));//strokeColor
    }
    for (int i = 0; i < 3; i++) {
      myArray[bgLength + arrayLength + i+3].update(new PVector(
      ((scaleFactor*docWidth/4)) ,//location (vector) - X
      (scaleFactor*(docHeight/9)*8 )),//location (vector) - Y
      random((docWidth/8/2)/4 , (docWidth/8/2)/3),//circleSize
      docWidth/30, //gravity
      random(docWidth/1200 , docWidth/600),//lineWeight
      color(int(255*i),0,0));//strokeColor
    }
    // ================ Page 2 (facing):
    for (int i = 0; i < 3; i++) {
      myArray[bgLength + arrayLength + i+6].update(new PVector(
      random(((scaleFactor*docWidth/4)*3) - (scaleFactor*150) , (scaleFactor*150) + ((scaleFactor*docWidth/4)*3)) ,//location (vector) - X
      random(scaleFactor*(docHeight/9)*7 , scaleFactor*(docHeight/9)*8.5)),//location (vector) - Y
      random((docWidth/8/2)/9 , (docWidth/8/2)/5),//circleSize
      docWidth/42, //gravity
      docWidth/600,//lineWeight
      color(0,0,0));//strokeColor
    }
    for (int i = 0; i < 3; i++) {
      myArray[bgLength + arrayLength + i+9].update(new PVector(
      ((scaleFactor*docWidth/4)*3) ,//location (vector) - X
      (scaleFactor*(docHeight/9)*8 )),//location (vector) - Y
      random((docWidth/8/2)/4 , (docWidth/8/2)/3),//circleSize
      docWidth/30, //gravity
      random(docWidth/1200 , docWidth/600),//lineWeight
      color(int(255*i),0,0));//strokeColor
    }
    //================================ BG:
    for (int i = 0; i < bgLength; i++) {
      myArray[i].update(new PVector(
      random(scaleFactor*docWidth) ,//location (vector) - X
      random(0, (scaleFactor*(docHeight/9)*8 ))),//location (vector) - Y
      random((docWidth/8/2)/15 , (docWidth/8/2)/12),//circleSize
      docWidth/66, //gravity
      random(docWidth/1800 , docWidth/900),//lineWeight
      210);//strokeColor
    }
    render();
    image(imageHolder, 0, 0);
  }
}
void render() {
  imageHolder.beginDraw();
  imageHolder.clear();
//  imageHolder.fill(255);
//  imageHolder.rect(-10, -10, width+10, height+10);
fill(255);
rect(-10, -10, width+10, height+10);
//  imageHolder.stroke(0);
//  imageHolder.fill(255);
  for (int i = 0; i< myArray.length; i++) {
    for (int j = 0; j< myArray.length; j++) {
      if ((myArray[i].location).dist(myArray[j].location) < myArray[i].gravity ) {
        imageHolder.strokeWeight(myArray[i].lineWeight/2);
        imageHolder.stroke(myArray[i].strokeColor);
        imageHolder.line(myArray[i].location.x, myArray[i].location.y, myArray[j].location.x, myArray[j].location.y);
      }
    }
  }
  for (int i = 0; i< myArray.length; i++) {
    imageHolder.stroke(myArray[i].strokeColor);
    println(myArray[i].strokeColor);
    imageHolder.strokeWeight(myArray[i].lineWeight);
    imageHolder.ellipse(myArray[i].location.x, myArray[i].location.y, myArray[i].circleSize, myArray[i].circleSize);
  }
  imageHolder.strokeWeight(.3 * scaleFactor);
  imageHolder.line(docWidth * scaleFactor/2, 0, docWidth * scaleFactor/2, docHeight * scaleFactor);
  imageHolder.endDraw();
}
class Points {
  PVector location;
  float circleSize;
  float gravity;
  float lineWeight;
  color strokeColor;
  Points() {
    //    location = new PVector (random(-100, width+ 100), random(-100, height+100));
    //    circleSize = random( 3, 15);
  }
  void update() {
    location = new PVector (scaleFactor * random(0, docWidth), scaleFactor * random((docHeight/7)*6, (docHeight/42)*41));
    circleSize = random( scaleFactor * circleSizeMin, scaleFactor * circleSizeMax);
    gravity = scaleFactor * random(minDistance, maxDistance);
    lineWeight = random(scaleFactor *lineWeightMin, scaleFactor *lineWeightMax);
    strokeColor = color((lineWeight*66)/scaleFactor,(lineWeight*66)/scaleFactor,(lineWeight*66)/scaleFactor);
  }
  void update(PVector location_, float circleSize_, float gravity_, float lineWeight_, color strokeColor_) {
    location = location_;
    circleSize = scaleFactor * circleSize_;
    gravity = scaleFactor * gravity_;
    lineWeight = scaleFactor * lineWeight_;
    strokeColor = strokeColor_;
  }
}

