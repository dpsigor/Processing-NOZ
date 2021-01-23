PImage img;
PImage square;
PImage to_save;
String filename;
String filename_to_save;
int normalizedWidth;
int normalizedHeight;
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

int xOffSet;
int yOffSet;

public void settings() {
  size(parseInt(args[2]), parseInt(args[3]));
}
 
void setup() {
  frameRate(0.1);
  if (args != null) {
    filename = args[0];
    filename_to_save = args[1];
    normalizedWidth = parseInt(args[2]);
    normalizedHeight = parseInt(args[3]);
    cols = parseInt(args[4]);
    rows = parseInt(args[5]);
    iCols = parseInt(args[6]);
    iRows = parseInt(args[7]);
    flipVertical = parseBoolean(args[8]);
  };
  img = loadImage(filename);

  squareW = normalizedWidth/cols;
  squareH = normalizedHeight/rows;
  println("img.width: "+img.width);
  println("img.height: "+img.height);
  println("args[2]: "+args[2]);
  println("args[3]: "+args[3]);
  println("squareW: "+squareW);
  println("squareH: "+squareH);
}

void draw() {
  background(255);
  image(img, 0, 0, normalizedWidth, normalizedHeight);
  for (i = 0; i < cols; ++i) {
    for (j = 0; j < rows; ++j) {
      square = get(squareW*i, squareH*j, squareW, squareH);
      for (m = 0; m < iCols; ++m) {
        for (n = 0; n < iRows; ++n) {
          xOffSet = squareW*i + squareW*m/iCols;
          yOffSet = squareH*j + squareH*n/iRows;
          pushMatrix();
          translate(xOffSet, yOffSet);
          if (m % 2 != 0 && n % 2 != 0 && flipVertical) {           // flip hor e ver
            pushMatrix();
            translate(squareW/iCols, squareH/iRows);
            scale(-1, -1);
            image(square, 0, 0, squareW/iCols, squareH/iRows);
            popMatrix();
          } else if (m % 2 != 0) {                                  // flip apenas hor
            pushMatrix();
            translate(squareW/iCols, 0);
            scale(-1, 1);
            image(square, 0, 0, squareW/iCols, squareH/iRows);
            popMatrix();
          } else if (n % 2 != 0 && flipVertical) {                  // flip apenas vertical
            pushMatrix();
            translate(0, squareH/iRows);
            scale(1, -1);
            image(square, 0, 0, squareW/iCols, squareH/iRows);
            popMatrix();
          } else {                                                  // não flip
            image(square, 0, 0, squareW/iCols, squareH/iRows);
          }
          popMatrix();
        }          
      }
    }
  }
  to_save = get(0, 0, normalizedWidth, normalizedHeight);
  to_save.save(filename_to_save);
  exit();
}
