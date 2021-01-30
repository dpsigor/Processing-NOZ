PImage img;
PImage square;
String inputFilePath;
String outputPath;
int x1,
int y2

public void settings() {
  size(100, 100);
}
 
void setup() {
  frameRate(0.1);
  if (args != null) {
    inputFilename = args[0];
    outputPath = args[1];
    
}

void draw() {
  background(255);
  
}
