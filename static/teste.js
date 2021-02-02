function setup() {
  createCanvas(400, 400);
  // colorMode(HSB);
}

function draw() {
  // background(0);
  // fill(255, 0, 0);
  // rect(0, 0, 50, 50);
  // translate(50, 0);
  // fill(0, 255, 0);
  // rect(0, 0, 50, 50);
  // translate(50, 0);
  // fill(0, 0, 255);
  // rect(0, 0, 50, 50);
  // translate(50, 0);
  // fill(100, 150, 200);
  // rect(0, 0, 50, 50);
  // translate(50, 0);
  // fill(255, 255, 255);
  // rect(0, 0, 50, 50);
  fill(255, 0, 0);
  rect(0, 0, 200, 200);
  fill(0, 255, 0);
  rect(200, 0, 200, 200);
  fill(0, 0, 255);
  rect(0, 200, 200, 200);
  fill(0, 255, 255);
  rect(200, 200, 200, 200);
  loadPixels();
}

function mouseClicked() {
  const r = pixels[(mouseY*width + mouseX - 1)*4];
  const g = pixels[(mouseY*width + mouseX - 1)*4 + 1];
  const b = pixels[(mouseY*width + mouseX - 1)*4 + 2];
  console.log('r:', r, 'g:', g, 'b:', b);
  const c = color(r, g, b);
  const hu = hue(c);
  const sa = saturation(c);
  const br = brightness(c);
  console.log('hu:', hu, 'sa:', sa, 'br:', br)
}