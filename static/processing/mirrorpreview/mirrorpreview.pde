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
float scaling;

public void settings() {
  size(parseInt(10000), parseInt(10000));
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

  if (img.width * iCols > img.height * iRows && img.width * iCols > 10000) {
    scaling = 10000f/(parseFloat(img.width * iCols));
  } else if (img.height * iRows > img.width * iCols && img.height * iRows > 10000) {
    scaling = 10000f/(parseFloat(img.height * iRows));
  } else {
    scaling = 1;
  }
  
  squareW = parseInt((img.width/(cols*iCols))*iCols*scaling);
  squareH = parseInt((img.height/(rows*iRows))*iRows*scaling);
}

void draw() {
  background(255);
  image(img, 0, 0, parseInt((int) Math.ceil(scaling*img.width)), parseInt((int) Math.ceil(scaling*img.height)));
  for (int i = 0; i < cols; ++i) {
    for (int j = 0; j < rows; ++j) {
      square = get(squareW*(cols - i - 1), squareH*(rows - j - 1), squareW, squareH);
      pushMatrix();
      translate(squareW*(cols - i - 1)*iCols, squareH*(rows - j - 1)*iRows);
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
      popMatrix();
    }
  }
  img = get(0, 0, parseInt((int) squareW * cols * iCols), parseInt((int) squareH * rows * iRows));
  img.save(outputPath + "preview.png");
  exit();
}