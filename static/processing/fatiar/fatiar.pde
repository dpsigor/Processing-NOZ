PImage img;
PGraphics pg;
PImage modulo;
String inputFilePath;
String outputPath;
int x1;
int y1;
int pxs;
int cols;
int rows;

void setup() {
  size(100, 100);
  println(args[0]);
  inputFilePath = args[0];
  outputPath = args[1];
  x1 = parseInt(args[2]);
  y1 = parseInt(args[3]);
  pxs = parseInt(args[4]);
  cols = parseInt(args[5]);
  rows = parseInt(args[6]);
  pg = createGraphics(pxs, pxs);
  img = loadImage(inputFilePath);
}

void draw() {
  for (int i = 0; i < cols; ++i) {
    for (int j = 0; j < rows; ++j) {
      pg.beginDraw();
      pg.image(img, -x1 - i*pxs, -y1 - j*pxs);
      pg.save(outputPath + "/modulo_" + i + "_" + j + ".png");
      pg.endDraw();
    }
  }
  exit();
}
