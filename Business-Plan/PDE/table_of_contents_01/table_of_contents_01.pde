Points mover;
int docWidth, docHeight;
int dpi = 300; //TODO!
float scaleFactor = 4.2;
int bgLength = 666;
int tableOfContentLength = 10*2;
int tableOfContentLength2 = 10*2; // the second page (English)
float minDistance, maxDistance, lineWeightMin, lineWeightMax, circleSizeMin, circleSizeMax;
Points[] myArray = new Points[(bgLength + tableOfContentLength + tableOfContentLength2)];
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
//  size(int(scaleFactor * docWidth), int(scaleFactor * docHeight)); // Comment out afterward
  imageHolder = createGraphics(int(scaleFactor * docWidth), int(scaleFactor * docHeight));
  for (int i = 0; i< myArray.length; i++) {
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

    //    for (int i = 0; i < 3; i++) {
    //      myArray[bgLength + i].update(new PVector(
    //      ((scaleFactor*docWidth/4)) ,//location (vector) - X
    //      (scaleFactor*(docHeight/9)*8 )),//location (vector) - Y
    //      random((docWidth/8/2)/4 , (docWidth/8/2)/3),//circleSize
    //      docWidth/30, //gravity
    //      random(docWidth/1200 , docWidth/600),//lineWeight
    //      color(int(255*i),0,0));//strokeColor
    //    }
    //================================ Table Of Contents:
    for (int i = 0; i < tableOfContentLength; i++) {
      if (i < tableOfContentLength/4) {
        myArray[(myArray.length - tableOfContentLength) + i].update(new PVector(
        ((scaleFactor*docWidth/20)), //location (vector) - X
        ((scaleFactor*i*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/5, (docWidth/8/2)/4), //circleSize
        docWidth/45, //gravity
        random(docWidth/666, docWidth/333), //lineWeight
        color(255, 0, 0));//strokeColor
      } else if (i < tableOfContentLength/2) {
        myArray[(myArray.length - tableOfContentLength) + i].update(new PVector(
        scaleFactor*((docWidth/20) + docWidth/48), //location (vector) - X
        ((scaleFactor*(i-(tableOfContentLength/4))*42) + scaleFactor*(docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/9, (docWidth/8/2)/8), //circleSize
        docWidth/45, //gravity
        random(docWidth/999, docWidth/666), //lineWeight
        color(255, 0, 0));//strokeColor
      } else if (i< 3*(tableOfContentLength/4)) {
        myArray[(myArray.length - tableOfContentLength) + i].update(new PVector(
        scaleFactor*((docWidth/4)), //location (vector) - X
        ((scaleFactor*(i-(tableOfContentLength/2))*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/5, (docWidth/8/2)/4), //circleSize
        docWidth/45, //gravity
        random(docWidth/666, docWidth/333), //lineWeight
        color(255, 0, 0));//strokeColor
      } else {
        myArray[(myArray.length - tableOfContentLength) + i].update(new PVector(
        scaleFactor*((docWidth/4)+ docWidth/48), //location (vector) - X
        ((scaleFactor*(i-((tableOfContentLength/4)*3))*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/9, (docWidth/8/2)/8), //circleSize
        docWidth/45, //gravity
        random(docWidth/999, docWidth/666), //lineWeight
        color(255, 0, 0));//strokeColor
      }
    }
    //================================ Table Of Contents:   (SECOND PAGE)
    for (int i = 0; i < tableOfContentLength2; i++) {
      if (i < tableOfContentLength2/4) {
        myArray[(myArray.length - (tableOfContentLength + tableOfContentLength2)) + i].update(new PVector(
        ((scaleFactor*docWidth/20) + scaleFactor * (docWidth/2)), //location (vector) - X
        ((scaleFactor*i*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/5, (docWidth/8/2)/4), //circleSize
        docWidth/45, //gravity
        random(docWidth/666, docWidth/333), //lineWeight
        color(255, 0, 0));//strokeColor
      } else if (i < tableOfContentLength/2) {
        myArray[(myArray.length - (tableOfContentLength + tableOfContentLength2)) + i].update(new PVector(
        scaleFactor*((docWidth/20) + docWidth/48 + (docWidth/2)), //location (vector) - X
        ((scaleFactor*(i-(tableOfContentLength/4))*42) + scaleFactor*(docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/9, (docWidth/8/2)/8), //circleSize
        docWidth/45, //gravity
        random(docWidth/999, docWidth/666), //lineWeight
        color(255, 0, 0));//strokeColor
      } else if (i< 3*(tableOfContentLength/4)) {
        myArray[(myArray.length - (tableOfContentLength + tableOfContentLength2)) + i].update(new PVector(
        scaleFactor*((docWidth/4)+(docWidth/2)), //location (vector) - X
        ((scaleFactor*(i-(tableOfContentLength/2))*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/5, (docWidth/8/2)/4), //circleSize
        docWidth/45, //gravity
        random(docWidth/666, docWidth/333), //lineWeight
        color(255, 0, 0));//strokeColor
      } else {
        myArray[(myArray.length - (tableOfContentLength + tableOfContentLength2)) + i].update(new PVector(
        scaleFactor*((docWidth/4)+ docWidth/48 + (docWidth/2)), //location (vector) - X
        ((scaleFactor*(i-((tableOfContentLength/4)*3))*42) + (scaleFactor*docHeight/4.2) )), //location (vector) - Y
        random((docWidth/8/2)/9, (docWidth/8/2)/8), //circleSize
        docWidth/45, //gravity
        random(docWidth/999, docWidth/666), //lineWeight
        color(255, 0, 0));//strokeColor
      }
    }
    //================================ BG:
    for (int i = 0; i < bgLength; i++) {
      myArray[i].update(new PVector(
      random(scaleFactor*docWidth), //location (vector) - X
      random(0, (scaleFactor*(docHeight) ))), //location (vector) - Y
      random((docWidth/8/2)/15, (docWidth/8/2)/12), //circleSize
      docWidth/66, //gravity
      random(docWidth/1800, docWidth/900), //lineWeight
      210);//strokeColor
    }
    render();
    image(imageHolder, 0, 0);
  }
}
void render() {
  imageHolder.beginDraw();
  imageHolder.clear();
//  imageHolder.fill(255);// Comment out afterward
//  imageHolder.rect(-10, -10, width+10, height+10);// Comment out afterward
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
  }
  void update() {
    location = new PVector (scaleFactor * random(0, docWidth), scaleFactor * random((docHeight/7)*6, (docHeight/42)*41));
    circleSize = random( scaleFactor * circleSizeMin, scaleFactor * circleSizeMax);
    gravity = scaleFactor * random(minDistance, maxDistance);
    lineWeight = random(scaleFactor *lineWeightMin, scaleFactor *lineWeightMax);
    strokeColor = color((lineWeight*66)/scaleFactor, (lineWeight*66)/scaleFactor, (lineWeight*66)/scaleFactor);
  }
  void update(PVector location_, float circleSize_, float gravity_, float lineWeight_, color strokeColor_) {
    location = location_;
    circleSize = scaleFactor * circleSize_;
    gravity = scaleFactor * gravity_;
    lineWeight = scaleFactor * lineWeight_;
    strokeColor = strokeColor_;
  }
}

