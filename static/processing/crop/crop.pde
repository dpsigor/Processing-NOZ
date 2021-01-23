String filename;
String croppedFilename;
PImage img;
PImage to_save;
String texto;
int x1;
int y1;
int x2;
int y2;
 
void setup() {
  size(10000, 10000);
  frameRate(1);
  // surface.setResizable(true);
  if (args != null) {
    filename = args[0];
    croppedFilename = args[1];
    x1 = parseInt(args[2]);
    y1 = parseInt(args[3]);
    x2 = parseInt(args[4]);
    y2 = parseInt(args[5]);
  };
  img = loadImage(filename);
  println("widht: ", img.width);
  println("height: ", img.height);
  println("x2: ", x2);
  println("y2: ", y2);
  // surface.setSize(img.width, img.height);
}

void draw() {
  image(img, 0, 0, img.width, img.height);
  to_save = get(x1, y1, x2 - x1, y2 - y1);
  to_save.save(croppedFilename);
  exit();
}
