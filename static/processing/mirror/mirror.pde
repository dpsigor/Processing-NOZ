PImage img;
PImage square;
String inputFilename;
String outputPath;
String filenameSemExt;
int cols;
int rows;
int iCols;
int iRows;
boolean flipVertical;
int squareW;
int squareH;
int i;
int j;
int m;
int n;

public void settings() {
  size(parseInt(args[3]), parseInt(args[4]));
}
 
void setup() {
  frameRate(0.1);
  if (args != null) {
    inputFilename = args[0];
    outputPath = args[1];
    filenameSemExt = args[2];
    cols = parseInt(args[5]);
    rows = parseInt(args[6]);
    iCols = parseInt(args[7]);
    iRows = parseInt(args[8]);
    flipVertical = parseBoolean(args[9]);
  };
  img = loadImage(inputFilename);

  squareW = parseInt(img.width/(cols*iCols))*iCols;
  squareH = parseInt(img.height/(rows*iRows))*iRows;
}

void draw() {
  background(255);
  int k = 0;
  for (int i = 0; i < cols; ++i) {
    for (int j = 0; j < rows; ++j) {
      image(img, 0, 0, img.width, img.height);
      square = get(squareW*i, squareH*j, squareW, squareH);
      for (int m = 0; m < iCols; ++m) {
        for (int n = 0; n < iRows; ++n) {
          pushMatrix();
          translate(m*squareW, n*squareH);
          if (m % 2 != 0 && n % 2 != 0 && flipVertical) {           // flip hor e ver
            pushMatrix();
            translate(squareW, squareH);
            scale(-1, -1);
            image(square, 0, 0, squareW, squareH);
            popMatrix();
          } else if (m % 2 != 0) {                                  // flip apenas hor
            pushMatrix();
            translate(squareW, 0);
            scale(-1, 1);
            image(square, 0, 0, squareW, squareH);
            popMatrix();
          } else if (n % 2 != 0 && flipVertical) {                  // flip apenas vertical
            pushMatrix();
            translate(0, squareH);
            scale(1, -1);
            image(square, 0, 0, squareW, squareH);
            popMatrix();
          } else {                                                  // não flip
            image(square, 0, 0, squareW, squareH);
          }
          popMatrix();
        }
      }
      square = get(0, 0, squareW*iCols, squareH*iRows);
      square.save(outputPath + "module_" + k + ".png");
      ++k;
    }
  }
  // save(outputPath + filenameSemExt + ".png");
  exit();
}
