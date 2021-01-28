let originalImg = document.querySelector('.img-preview');
const previewProcessedBtn = document.querySelector('.preview-processed-img');
const saveProcessedBtn = document.querySelector('.save-processed-img');
const loadingProcessBtn = document.querySelector('.loading-mirror-btn');
document.querySelector('.flip-vertical').checked = false;

let sketch;

let img;

let originalW;
let originalH;

let previewedFilename;
let clientWidth;
let clientHeight;
let cols;
let rows;
let iCols;
let iRows;
let squareW;
let squareH;
let flipVertical;

const s = (p) => {
  p.setup = () => {
    p.createCanvas(squareW*cols*iCols, squareH*rows*iRows);
    p.frameRate(1);
    img = p.loadImage('../files/' + previewedFilename);
  }
  
  p.draw = () => {
    p.background('#FF0000');
    p.image(img, 0, 0, clientWidth, clientHeight);
    for (i = 0; i < cols; ++i) {
      for (j = 0; j < rows; ++j) {
        square = p.get(squareW*(cols - i - 1), squareH*(rows - j - 1), squareW, squareH);
        p.push();
        p.translate(squareW*(cols - i - 1)*iCols, squareH*(rows - j - 1)*iRows);
        for (m = 0; m < iCols; ++m) {
          for (n = 0; n < iRows; ++n) {
            p.push();
            p.translate(m*squareW, n*squareH);
            if (m % 2 != 0 && n % 2 != 0 && flipVertical) {           // flip hor e ver
              p.push();
              p.translate(squareW, squareH);
              p.scale(-1, -1);
              p.image(square, 0, 0, squareW, squareH);
              p.pop();
            } else if (m % 2 != 0) {                                  // flip apenas hor
              p.push();
              p.translate(squareW, 0);
              p.scale(-1, 1);
              p.image(square, 0, 0, squareW, squareH);
              p.pop();
            } else if (n % 2 != 0 && flipVertical) {                  // flip apenas vertical
              p.push();
              p.translate(0, squareH);
              p.scale(1, -1);
              p.image(square, 0, 0, squareW, squareH);
              p.pop();
            } else {                                                  // não flip
              p.image(square, 0, 0, squareW, squareH);
            }
            p.pop();
          }
        }
        p.pop();
      }
    }
  }
}

previewProcessedBtn.addEventListener('click', () => {
  if (document.querySelector(".dynamic-crop")) { document.querySelector(".dynamic-crop").remove(); }
  if (sketch) { sketch.remove() }
  originalImg = document.querySelector('.img-preview');
  if (!originalImg.clientWidth) { return }
  previewedFilename = document.querySelector('.file-select').value;
  originalW = originalImg.naturalWidth;
  originalH = originalImg.naturalHeight;
  cols = document.querySelector('.cols-input').value;
  rows = document.querySelector('.rows-input').value;
  iCols = document.querySelector('.icols-input').value;
  iRows = document.querySelector('.irows-input').value;
  flipVertical = document.querySelector('.flip-vertical').checked;
  if (!cols || !rows) { return }

  let scaling = 1;
  if (originalW * iCols > originalH * iRows && originalW * iCols > 10000) {
    scaling = 10000/(originalW * iCols);
  } else if (originalH * iRows > originalW * iCols && originalH * iRows > 10000) {
    scaling = 10000/(originalH * iRows);
  }

  squareW = Math.floor(Math.floor(originalW/(cols*iCols))*iCols*scaling);
  squareH = Math.floor(Math.floor(originalH/(rows*iRows))*iRows*scaling);

  sketch = new p5(s, 'processada-container');
})

saveProcessedBtn.addEventListener('click', () => {
  saveProcessedBtn.setAttribute("style", "display: none");
  loadingProcessBtn.setAttribute("style", "display: block");
  if (document.querySelector(".dynamic-crop")) { document.querySelector(".dynamic-crop").remove(); }
  axios.post(apiUrl + 'processing/run', { previewedFilename, originalW, originalH, cols, rows, iCols, iRows, flipVertical })
    .then(res => { alert(res.data); console.log(res); saveProcessedBtn.setAttribute("style", "display: block"); loadingProcessBtn.setAttribute("style", "display: none"); })
    .catch(err => { console.log(err); alert(err.message); saveProcessedBtn.setAttribute("style", "display: block"); loadingProcessBtn.setAttribute("style", "display: none"); })
});

