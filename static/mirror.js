let originalImg = document.querySelector('.img-preview');
const previewProcessedBtn = document.querySelector('.preview-processed-img');
// const saveProcessedBtn = document.querySelector('.save-processed-img');
const loadingProcessBtn = document.querySelector('.loading-mirror-btn');
const imgContainer = document.querySelector('.img-container');
const imgPreview = document.querySelector('.img-preview');


document.querySelector('.flip-vertical').checked = false;
document.querySelector('.lado-max').value = 10000;

let Px1
let Py1
let Px2
let Py2

let ladoMax;
let scaling = 1;
let sketch;


let originalW;
let originalH;
let croppedW;
let croppedH;

let previewedFilename;
let cols;
let rows;
let iCols;
let iRows;
let squareW;
let squareH;
let flipVertical;

const s = (p) => {
  let img;
  p.setup = () => {
    p.createCanvas(squareW*cols*iCols, squareH*rows*iRows);
    p.frameRate(1);
    img = p.loadImage('../files/' + previewedFilename);
  }
  
  p.draw = () => {
    p.background('#FF0000');
    p.image(img, -Px1*scaling, -Py1*scaling, originalW*scaling, originalH*scaling);
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
    p.noLoop();
  }
}

const makeSketch = () => {
  if (sketch) { sketch.remove() }
  document.querySelector('.scale-res').innerHTML = '';
  originalImg = document.querySelector('.img-preview');
  ladoMax = parseInt(document.querySelector('.lado-max').value);
  previewedFilename = document.querySelector('.file-select').value;
  originalW = originalImg.naturalWidth;
  originalH = originalImg.naturalHeight;
  cols = document.querySelector('.cols-input').value;
  rows = document.querySelector('.rows-input').value;
  iCols = document.querySelector('.icols-input').value;
  iRows = document.querySelector('.irows-input').value;
  flipVertical = document.querySelector('.flip-vertical').checked;
  if (!cols || !rows || !iCols || !iRows) { return }
  
  Px1 = Math.round(x1*originalW/originalImg.clientWidth);
  Py1 = Math.round(y1*originalH/originalImg.clientHeight);
  Px2 = Math.round(x2*originalW/originalImg.clientWidth);
  Py2 = Math.round(y2*originalH/originalImg.clientHeight);
  
  croppedW = Px2 - Px1;
  croppedH = Py2 - Py1;
  if (!croppedW || !croppedH) { croppedW = originalW; croppedH = originalH; };
  
  scaling = 1;
  if (croppedW * iCols > croppedH * iRows && croppedW * iCols > ladoMax) {
    scaling = ladoMax/(croppedW * iCols);
  } else if (croppedH * iRows > croppedW * iCols && croppedH * iRows > ladoMax) {
    scaling = ladoMax/(croppedH * iRows);
  }

  document.querySelector('.scale-res').innerHTML = `Scale: ${Math.round(scaling*100)}%`;

  squareW = Math.floor(Math.floor(croppedW/(cols*iCols))*iCols*scaling);
  squareH = Math.floor(Math.floor(croppedH/(rows*iRows))*iRows*scaling);

  sketch = new p5(s, 'processada-container');
}


previewProcessedBtn.addEventListener('click', () => { makeSketch(); });


// saveProcessedBtn.addEventListener('click', () => {
//   saveProcessedBtn.setAttribute("style", "display: none");
//   loadingProcessBtn.setAttribute("style", "display: block");
//   if (document.querySelector(".dynamic-crop")) { document.querySelector(".dynamic-crop").remove(); }
//   axios.post(apiUrl + 'processing/run', { previewedFilename, originalW, originalH, cols, rows, iCols, iRows, flipVertical })
//     .then(res => { alert(res.data); console.log(res); saveProcessedBtn.setAttribute("style", "display: block"); loadingProcessBtn.setAttribute("style", "display: none"); })
//     .catch(err => { console.log(err); alert(err.message); saveProcessedBtn.setAttribute("style", "display: block"); loadingProcessBtn.setAttribute("style", "display: none"); })
// });

// Select de files
document.querySelector('.atualizar-files').addEventListener('click', () => {
  axios.get(apiUrl + 'filelist').then(res => {
    const imgFilenames = res.data;
    nFilesEmDisco = imgFilenames.length;
    const fileSelect = document.querySelector('.file-select');
    fileSelect.innerHTML = '';
    fileSelect.addEventListener('change', () => {
      imgPreview.setAttribute("src", `../files/${fileSelect.value}`);
      const toDel = document.querySelector(".dynamic-crop");
      if (toDel) { toDel.remove() };
      x1 = 0; y1 = 0; x2 = 0; y2 = 0;
    })
    imgFilenames.forEach(filename => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(filename));
      opt.value = filename;
      fileSelect.appendChild(opt);
    });
    document.querySelector('.atualizar-files').innerHTML = '<i class="fas fa-sync"></i> Recarregar';
    imgPreview.setAttribute("src", `../files/${fileSelect.value}`);
  });
});
document.querySelector('.btn-anterior').addEventListener('click', () => {
  const fileSelect = document.querySelector('.file-select');
  if (fileSelect.selectedIndex > 0) { fileSelect.selectedIndex = fileSelect.selectedIndex - 1 };
  imgPreview.setAttribute("src", `../files/${fileSelect.value}`);
});
document.querySelector('.btn-proximo').addEventListener('click', () => {
  const fileSelect = document.querySelector('.file-select');
  if (fileSelect.selectedIndex < nFilesEmDisco - 1) { fileSelect.selectedIndex = fileSelect.selectedIndex + 1 };
  imgPreview.setAttribute("src", `../files/${fileSelect.value}`);
});

colsInput.value = 1;
rowsInput.value = 1;
icolsInput.value = 1;
irowsInput.value = 1;
colsInput.addEventListener('input', () => {
  colsInput.value = colsInput.value.replace(/[^0-9]/g, '')
  if (colsInput.value > 200) { alert(`Cuidado! Esse valor ${colsInput.value} é muito alto...`) }
});
rowsInput.addEventListener('input', () => {
  rowsInput.value = rowsInput.value.replace(/[^0-9]/g, '');
  if (rowsInput.value > 200) { alert(`Cuidado! Esse valor ${rowsInput.value} é muito alto...`) }
});
icolsInput.addEventListener('input', () => {
  icolsInput.value = icolsInput.value.replace(/[^0-9]/g, '')
  if (icolsInput.value > 200) { alert(`Cuidado! Esse valor ${icolsInput.value} é muito alto...`) }
});
irowsInput.addEventListener('input', () => {
  irowsInput.value = irowsInput.value.replace(/[^0-9]/g, '');
  if (irowsInput.value > 200) { alert(`Cuidado! Esse valor ${irowsInput.value} é muito alto...`) }
});
icolsInput.addEventListener('focus', () => {
  const popup = document.getElementById("myPopup");
  popup.setAttribute("class", "popuptext show");
})
icolsInput.addEventListener('blur', () => {
  const popup = document.getElementById("myPopup");
  popup.setAttribute("class", "popuptext");
})