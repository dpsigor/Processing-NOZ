// São oito argumentos no total
// args[0] substituir pelo caminho do arquivo original: /Ursers/etc.../arquivo.png
// args[1] substituir pelo caminho do arquivo a salvar: /Users/etc.../salvo.png -> se quiser salvar em jpg, por exemplo, colocaar .jpg ao invés de .png
// args[2] substituir pela largura em pixels da imagem original vezes número de colunas
// args[3] substituir pela altura em pixels da imagem original vezes número de linhas
// args[4] -> número de colunas
// args[5] -> número de linhas
// args[6] -> número de colunas internas
// args[7] -> número de linhas interas
// args[8] = Flipar? true ou false

PImage img;
PImage square;
// PImage to_save;
String filename;
String filename_to_save;
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

int widthDiff;
int heightDiff;

public void settings() {
  size(19055, 15245);
}
 
void setup() {
  frameRate(0.1);
  //if (args != null) {
    filename = "C:/Users/dpsig/dev/met-museum-bot/static/files/208554_0.jpg";
    filename_to_save = "C:/Users/dpsig/dev/met-museum-bot/output/mirror/208554_0-1611586533500.jpg";
    cols = 5;
    rows = 5;
    iCols = 5;
    iRows = 5;
    flipVertical = true;
  //};
  img = loadImage(filename);

  squareW = 19055/(cols * iCols);
  squareH = 15245/(rows * iRows);
}

void draw() {
  background(255);
  image(img, 0, 0, img.width, img.height);
  for (int i = 0; i < cols; ++i) {
    for (int j = 0; j < rows; ++j) {
      square = get(squareW*(cols - i - 1), squareH*(rows - j - 1), squareW, squareH);
      pushMatrix();
      translate(squareW*(cols - i - 1)*iCols, squareH*(rows - j - 1)*iRows);
      // image(square, 0, 0, squareW, squareH);
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
  save(filename_to_save);
  exit();
}
