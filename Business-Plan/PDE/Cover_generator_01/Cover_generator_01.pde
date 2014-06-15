Points mover;
int docWidth, docHeight;
int dpi = 300; //TODO!
float scaleFactor = 4.2;
int arrayLength = 300;
float minDistance, maxDistance, lineWeightMin, lineWeightMax, circleSizeMin, circleSizeMax;
Points[] myArray = new Points[(arrayLength + 3)];
PGraphics imageHolder;
void setup() {
  docWidth = 842*2;
  docHeight = 298;
  minDistance = 33;
  maxDistance = 72;
  lineWeightMin = 1;
  lineWeightMax = 3;
  circleSizeMin = 3;
  circleSizeMax = 15;
//  size(int(scaleFactor * docWidth), int(scaleFactor * docHeight));
  imageHolder = createGraphics(int(scaleFactor * docWidth), int(scaleFactor * docHeight));
  for (int i = 0; i< arrayLength; i++) {
    myArray[i] = new Points();
  }
  for (int i = 0; i < 3; i++) {
    myArray[arrayLength + i] = new Points();
  }
}
void draw() {
}
int fileName = 0;
void keyPressed() {
  if (key == 's') {
    fileName ++;
    imageHolder.save(fileName+"_cover.png");
  } else {
    for (int i = 0; i< arrayLength; i++) {
      myArray[i].update();
    }
    for (int i = 0; i < 3; i++) {
      myArray[arrayLength + i].update(new PVector(
      (scaleFactor*docWidth/8/2) + ((scaleFactor*docWidth/8/2)*i),//location (vector) - X
      (scaleFactor*docHeight/2)),//location (vector) - Y
      (docWidth/8/2)/2,//circleSize
      docWidth/23, //gravity
      docWidth/500,//lineWeight
      (255));//strokeColor
    }println(docWidth/66);
    render();
    image(imageHolder, 0, 0);
  }
}
void render() {
  imageHolder.beginDraw();
  imageHolder.clear();
  imageHolder.fill(0);
//  imageHolder.rect(-10, -10, width+10, height+10);
  imageHolder.stroke(255);
  imageHolder.fill(0);
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
    //    imageHolder.stroke(255);
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
    location = new PVector (scaleFactor * random(-100, docWidth+ 100), scaleFactor * random(-100, docHeight+100));
    circleSize = random( scaleFactor * circleSizeMin, scaleFactor * circleSizeMax);
    gravity = scaleFactor * random(minDistance, maxDistance);
    lineWeight = random(scaleFactor *lineWeightMin, scaleFactor *lineWeightMax);
    strokeColor = color((lineWeight*66)/scaleFactor);
  }
  void update(PVector location_, float circleSize_, float gravity_, float lineWeight_, color strokeColor_) {
    location = location_;
    circleSize = scaleFactor * circleSize_;
    gravity = scaleFactor * gravity_;
    lineWeight = scaleFactor * lineWeight_;
    strokeColor = strokeColor_;
  }
}

