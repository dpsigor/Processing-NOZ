let fatiarImg = document.querySelector('.fatiar-img-preview');

document.querySelector('.f-pixels-input').value = 300;

// Grid
let fx1 = 0;
let fy1 = 0;
let fx2 = 0;
let fy2 = 0;
let fCols;
let fRows;
let fPixels = 300;

const updateFatiarGrid = () => {
  clearFatiarBox();
  const fatiarCropDiv = document.createElement("div");
  fatiarCropDiv.setAttribute("style", `
    position: absolute; z-index: 100; outline: blue 1px solid;
    top: ${fy1}px; left: ${fx1}px;
    width: ${fx2 - fx1}px; height: ${fy2 - fy1}px;
  `);
  fatiarCropDiv.setAttribute("class", `fatiar-dynamic-crop`);
  document.querySelector('.fatiar-img-container').append(fatiarCropDiv);
  makeGrid();
}

// Select de files
const loadFilenameList = () => {
  axios.get(apiUrl + 'filelist').then(res => {
    const imgFilenames = res.data;
    nFilesEmDisco = imgFilenames.length;
    const fatiarFileSelect = document.querySelector('.fatiar-file-select');
    fatiarFileSelect.innerHTML = '';
    fatiarFileSelect.addEventListener('change', () => {
      fatiarImg.setAttribute("src", `../files/${fatiarFileSelect.value}`);
      resetFatiarBox();
    })
    imgFilenames.forEach(filename => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(filename));
      opt.value = filename;
      fatiarFileSelect.appendChild(opt);
    });
    fatiarImg.setAttribute("src", `../files/${fatiarFileSelect.value}`);
  });
}
loadFilenameList();

document.querySelector('.fatiar-atualizar-files').addEventListener('click', () => { loadFilenameList(); resetFatiarBox(); });
document.querySelector('.fatiar-btn-anterior').addEventListener('click', () => {
  resetFatiarBox();
  const fatiarFileSelect = document.querySelector('.fatiar-file-select');
  if (fatiarFileSelect.selectedIndex > 0) { fatiarFileSelect.selectedIndex = fatiarFileSelect.selectedIndex - 1 };
  fatiarImg.setAttribute("src", `../files/${fatiarFileSelect.value}`);
});
document.querySelector('.fatiar-btn-proximo').addEventListener('click', () => {
  resetFatiarBox();
  const fatiarFileSelect = document.querySelector('.fatiar-file-select');
  if (fatiarFileSelect.selectedIndex < nFilesEmDisco - 1) { fatiarFileSelect.selectedIndex = fatiarFileSelect.selectedIndex + 1 };
  fatiarImg.setAttribute("src", `../files/${fatiarFileSelect.value}`);
});

fatiarImg.addEventListener('mousedown', (e) => {
  e.preventDefault;
  switch (e.which) {
    case 1:
      resetFatiarBox();
      fx1 = e.offsetX; fy1 = e.offsetY;
      break;
    case 3:
      fx2 = e.offsetX; fy2 = e.offsetY;
      if (fx2 < fx1 || fy2 < fy1) { resetFatiarBox(); }
      else { updateFatiarGrid(); }
      break;
  }
})

const resetFatiarBox = () => {
  const toFatiarDel = document.querySelector(".fatiar-dynamic-crop");
  if (toFatiarDel) { toFatiarDel.remove(); fx1 = 0; fy1 = 0; fx2 = 0; fy2 = 0 };
  document.querySelectorAll('.fatiar-box').forEach(x => x.remove());
}

const clearFatiarBox = () => {
  const toFatiarDel = document.querySelector(".fatiar-dynamic-crop");
  if (toFatiarDel) { toFatiarDel.remove(); };
  document.querySelectorAll('.fatiar-box').forEach(x => x.remove());
}

const makeGrid = () => {
  if (fPixels >= 100) {
    let scaleF = fatiarImg.clientWidth / fatiarImg.naturalWidth;
    fCols = Math.floor((fx2 - fx1)/(fPixels*scaleF));
    fRows = Math.floor((fy2 - fy1)/(fPixels*scaleF));
    for (let i = 0; i < fCols; i++) {
      for (let j = 0; j < fRows; j++) {
        let gridBox = document.createElement("div");
        gridBox.setAttribute("style", `
          position: absolute; z-index: 101; outline: red 1px solid;
          top: ${fy1 + j*fPixels*scaleF}px; left: ${fx1 + i*fPixels*scaleF}px;
          width: ${fPixels*scaleF}px; height: ${fPixels*scaleF}px;
        `);
        gridBox.setAttribute("class", `fatiar-box`);
        gridBox.setAttribute("id", `box-${i}-${j}`);
        document.querySelector('.fatiar-img-container').append(gridBox);
      }
    }
  }
}

document.getElementById('down-fx1').addEventListener('click', () => {
  if (fx2 - fx1 > 2 && fx1 > 0) { fx1 -= 1; updateFatiarGrid(); };
})
document.getElementById('down-fx2').addEventListener('click', () => {
  if (fx2 - fx1 > 2) { fx2 -= 1; updateFatiarGrid(); };
})
document.getElementById('down-fy1').addEventListener('click', () => {
  if (fy2 - fy1 > 2) { fy1 += 1; updateFatiarGrid(); };
})
document.getElementById('down-fy2').addEventListener('click', () => {
  if (fy2 - fy1 > 2 && fy2 < fatiarImg.clientHeight) { fy2 += 1; updateFatiarGrid(); };
})
document.getElementById('up-fx1').addEventListener('click', () => {
  if (fx2 - fx1 > 2) { fx1 += 1; updateFatiarGrid(); };
})
document.getElementById('up-fx2').addEventListener('click', () => {
  if (fx2 - fx1 > 2 && fx2 < fatiarImg.clientWidth) { fx2 += 1; updateFatiarGrid(); };
})
document.getElementById('up-fy1').addEventListener('click', () => {
  if (fy2 - fy1 > 2 && fy1 > 0) { fy1 -= 1; updateFatiarGrid(); };
})
document.getElementById('up-fy2').addEventListener('click', () => {
  if (fy2 - fy1 > 2) { fy2 -= 1; updateFatiarGrid(); };
})

document.querySelector('.f-name').addEventListener('input', () => {
  document.querySelector('.f-name').value = document.querySelector('.f-name').value.replace(/[^a-zA-Z0-9_-]/g, '');
});

document.querySelector('.f-pixels-input').addEventListener('input', () => {
  document.querySelector('.f-pixels-input').value = document.querySelector('.f-pixels-input').value.replace(/[^0-9]/g, '');
  fPixels = document.querySelector('.f-pixels-input').value;
});

document.querySelector('.f-pixels-input').addEventListener('blur', () => {
  if (document.querySelector('.f-pixels-input').value < 100) {
    document.querySelector('.f-pixels-input').value = 100;
  }
  updateFatiarGrid();
})

document.querySelector('.generate-fatiar-btn').addEventListener('click', () => {
  if (document.querySelector('.fatiar-box') && document.querySelector('.f-name').value) {
    onFatiar();
    document.querySelector('.generate-fatiar-btn').setAttribute("style", "display: none");
    document.querySelector('.f-loading').setAttribute("style", "display: inline-block");
  } else { alert("Pelo menos uma caixa vermelha, e Nome") }
})

const onFatiar = () => {
    axios.post(apiUrl + 'fatiar', {
      filename: fatiarImg.getAttribute('src').split('/').pop(),
      groupname: document.querySelector('.f-name').value,
      x1: Math.floor(fx1 * fatiarImg.naturalWidth / fatiarImg.clientWidth),
      y1: Math.floor(fy1 * fatiarImg.naturalHeight / fatiarImg.clientHeight),
      pixels: fPixels,
      cols: fCols,
      rows: fRows
    })
      .then(res => {
      console.log(res.data);
      document.querySelector('.generate-fatiar-btn').setAttribute("style", "display: inline-block");
      document.querySelector('.f-loading').setAttribute("style", "display: none");
      }).catch(err => {
        document.querySelector('.generate-fatiar-btn').setAttribute("style", "display: inline-block");
        document.querySelector('.f-loading').setAttribute("style", "display: none");
        alert('Aconteceu um erro (axios post)');
      });
}