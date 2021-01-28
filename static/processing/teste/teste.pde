/*
processing-java --force --sketch="C:/Users/dpsig/dev/met-museum-bot/static/processing/teste" --output="C:/Users/dpsig/dev/met-museum-bot/static/processing/teste/out" --run EAEMAN
*/

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

PImage venus;
PImage teotokos;

int aux = 0;
int menorLength;
int extraLength;

int xIndex;
int zIndex;
int tiles;
int tileSize;

ArrayList<Integer> xList = new ArrayList<Integer>();
ArrayList<Integer> zList = new ArrayList<Integer>();
ArrayList<ArrayList<Integer>> xLists = new ArrayList<ArrayList<Integer>>();
ArrayList<ArrayList<Integer>> zLists = new ArrayList<ArrayList<Integer>>();

void setup() {
  size(900, 900, P3D);
  venus = loadImage("venus.gif");
  venus.resize(900, 900);
  venus.loadPixels();
  teotokos = loadImage("teotokos.gif");
  teotokos.resize(900,900);
  teotokos.loadPixels();
  // frameRate(10);
  tiles = 150;
  tileSize = width/tiles;

  for (int y = 0; y < tiles; y++) {
    for (int x = 0; x < tiles; x++) {
      color c1 = venus.pixels[int(x*tileSize) + int(y*tileSize)*height];
      float b1 = map(brightness(c1), 0, 255, 1, 0);
      if (b1 > 0.5) { 
        xList.add(x);
      };
      color c2 = teotokos.pixels[int(x*tileSize) + int(y*tileSize)*height];
      float b2 = map(brightness(c2), 0, 255, 1, 0);
      if (b2 > 0.5) { 
        zList.add(x);
      }
    }
    if(xList.size() == 0) { xList.add(1); }
    if(zList.size() == 0) { zList.add(1); }
    Collections.shuffle(xList);
    Collections.shuffle(zList);
    xLists.add(deepIntegerListCopy(xList));
    zLists.add(deepIntegerListCopy(zList));
    xList.clear();
    zList.clear();
  }
}

void draw() {
  background(#f1f1f1);
  push();
  translate(width/2,height/2);

  // if (mousePressed == true) {
    // rotateY(radians(frameCount));
  // }
  rotateY(radians(frameCount));

  scale(0.5);
  
  noFill();
  strokeWeight(1);
  stroke(0, 0, 255);
  box(900);
  noStroke();

  translate(-width/2, 0, width/2);
  for (int y = 0; y < tiles; y++) {
    // fill(0);
    // for (int x = 0; x < tiles; x++) {
      // color c = venus.pixels[int(x*tileSize) + int(y*tileSize)*height];
      // float b = map(brightness(c), 0, 255, 1, 0);
      
      // if (b > 0.5) { 
        // push();
        // translate(x*tileSize, y*tileSize - height/2);
        // box(tileSize);
        // pop();
      //   xList = add_element(xList, x);
      // };

      // color tc = teotokos.pixels[int(x*tileSize) + int(y*tileSize)*height];
      // float tb = map(brightness(tc), 0, 255, 1, 0);
      
      // if (tb > 0.5) { 
        // push();
        // rotateY(PI/2);
        // translate(x*tileSize, y*tileSize - height/2);
        // box(tileSize);
        // pop();
        // zList = add_element(zList, x);
      // }
    // }

    xIndex = 0;
    zIndex = 0;

    xList = xLists.get(y);
    zList = zLists.get(y);

    fill(255, 0, 0);
    if(xList.size() > zList.size()) {
      for (int i = 0; i < xList.size(); ++i) {
        if (i > zList.size() - 1) { zIndex = 0; }
        push();
        translate(xList.get(i) * tileSize, y * tileSize - height/2, -zList.get(zIndex) * tileSize);
        box(tileSize);
        pop();
        zIndex++;
      }
    } else {
      for (int i = 0; i < zList.size(); ++i) {
        if (i > xList.size() - 1) { xIndex = 0; }
        push();
        translate(xList.get(xIndex) * tileSize, y*tileSize - height/2, -zList.get(i) * tileSize);
        box(tileSize);
        pop();
        xIndex++;
      }
    }

    // xList.clear();
    // zList.clear();

  }
  pop();
}

// static List<Integer> add_element(List<Integer> myList, int ele)
// {
//   int i;
//   int n = myList.size();
//   ArrayList<Integer> newList = new ArrayList<Integer>();
//   for (i = 0; i < n; i++) {
//     newList.add(myList.get(i));
//   }
//   newList.add(new Integer(ele));

//   return newList;
// }

static ArrayList<Integer> deepIntegerListCopy(ArrayList<Integer> original) {
    ArrayList<Integer> copy = new ArrayList<Integer>();
    for (Integer s : original) {
        Integer copyOfInteger = new Integer(s);
        copy.add(copyOfInteger);
    }
    return copy;
}