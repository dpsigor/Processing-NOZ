PImage venus;
PImage teotokos;

void setup() {
  size(900, 900, P3D);
  venus = loadImage("venus.gif");
  venus.resize(900, 900);
  venus.loadPixels();
  teotokos = loadImage("teotokos.gif");
  teotokos.resize(900,900);
  teotokos.loadPixels();
}

void draw() {
  background(#f1f1f1);
  int tiles = 100;
  float tileSize = width/tiles;
  
  push();
  translate(width/2,height/2);
  rotateY(radians(frameCount));
  scale(0.5);
  
  noFill();
  strokeWeight(1);
  stroke(0, 0, 255);
  box(900);
  noStroke();
  
  translate(-width/2, 0, width/2);
  for (int x = 0; x < tiles; x++) {
    for (int y = 0; y < tiles; y++) {
      color c = venus.pixels[int(x*tileSize) + int(y*tileSize)*height];
      float b = map(brightness(c), 0, 255, 1, 0);
      
      if (b > 0.5) { 
      push();
      translate(x*tileSize, y*tileSize - height/2);
      fill(0);
      box(tileSize);
      pop();
      };
      color tc = teotokos.pixels[int(x*tileSize) + int(y*tileSize)*height];
      float tb = map(brightness(tc), 0, 255, 1, 0);
      
      if (tb > 0.5) { 
      push();
      rotateY(PI/2);
      translate(x*tileSize, y*tileSize - height/2);
      fill(0);
      box(tileSize);
      pop();
      }
      
      if (b > 0.5 && tb > 0.5) {
        push();
        rotateY(PI/2);
        translate(x*tileSize, y*tileSize - height/2, x*tileSize);
        fill(0);
        box(tileSize);
        pop();  
      }
      
    }
  }
  pop();
}
