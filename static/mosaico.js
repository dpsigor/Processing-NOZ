let mosaicoImg = document.querySelector('.mosaico-img-preview');
const mosaicoMsg = document.querySelector('.mosaico-msg');

// let semRepetir = true;
let mosaicoImgFilenames;
let mosaicoSketch;
let mScaling;
let mLadoMax;
document.querySelector('.mosaico-lado-max').value = 10000;
mLadoMax = 10000;
let mSelectedFolders = [];
let modulosData = {};
let boxesValues = [];
let selectedModules = [];
let start;

const mLerOriginal = (p) => {
  let img;
  let pg;
  let pg2;
  let box;
  let smallBox;

  p.preload = () => {
    img = p.loadImage(mosaicoImg.getAttribute('src'));
  }
  
  p.setup = () => {
    p.createCanvas(mGridLado*mCols, mGridLado*mRows);
    mosaicoMsg.innerHTML = '';
  }
  
  p.draw = () => {
    p.colorMode(p.HSB, 255);
    p.image(img, -mx1, -my1, mosaicoImg.clientWidth, mosaicoImg.clientHeight);

    p.noFill();
    for (let i = 0; i < mCols; i++) {
      for (let j = 0; j < mRows; j++) {
        p.rect(i*mGridLado, j*mGridLado, mGridLado, mGridLado);
      }
    }
    boxesValues = [];
    let lado = p.floor(mGridLado * mScaling);
    pg = p.createGraphics(lado*mCols, lado*mRows);
    pg.image(img, -mx1*mScaling, -my1*mScaling, img.width, img.height);
    for (let i = 0; i < mRows; i++) {
      for (let j = 0; j < mCols; j++) {
        let values = [];
        box = pg.get(j*lado, i*lado, lado, lado);
        pg2 = p.createGraphics(lado, lado);
        pg2.image(box, 0, 0, lado, lado);
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 3; n++) {
            smallBox = pg2.get(n*lado/3, m*lado/3, lado/3, lado/3);
            smallBox.loadPixels();
            let hue = 0;
            let saturation = 0;
            let brightness = 0;
            for (let k = 0; k < smallBox.pixels.length/4; k++) {
              let index = k*4;
              const r = smallBox.pixels[index];
              const g = smallBox.pixels[index+1];
              const b = smallBox.pixels[index+2];
              const c = p.color(r, g, b);
              hue += p.floor(p.hue(c));
              saturation += p.saturation(c);
              brightness += p.brightness(c);
            }
            const avgHue = hue/(smallBox.pixels.length/4); values.push(parseInt(avgHue));
            const avgSat = saturation/(smallBox.pixels.length/4); values.push(parseInt(avgSat));
            const avgBrg = brightness/(smallBox.pixels.length/4); values.push(parseInt(avgBrg));
          }
        }
        boxesValues.push([...values]);
      }
    }
    mosaicoMsg.innerHTML = `Leu a imagem em ${Math.floor((new Date().valueOf() - start)/1000)}s.`;
    console.log(boxesValues);
    img = '';
    pg = '';
    pg2 = '';
    box = '';
    smallBox = '';
    matchModules();
    p.noLoop();
  }
}

const mosaicoCalcular = async () => {
  try {
    await loadModulosDados();
    if (mosaicoSketch) { mosaicoSketch.remove() };
    // mLadoMax = parseInt(document.querySelector('.mosaico-lado-max').value);
    mosaicoSketch = new p5(mLerOriginal, 'mosaico-canvas');
  } catch (error) {
    console.log(error);
    alert('Ocorreu um erro (mosaicoCalcular)')
  }
}

const mosaicoLoadFilenameList = () => {
  axios.get(apiUrl + 'filelist').then(res => {
    mosaicoImgFilenames = res.data;
    const mosaicoFileSelect = document.querySelector('.mosaico-file-select');
    mosaicoFileSelect.innerHTML = '';
    mosaicoFileSelect.addEventListener('change', () => {
      mosaicoImg.setAttribute("src", `../files/${mosaicoFileSelect.value}`);
    })
    mosaicoImgFilenames.forEach(filename => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(filename));
      opt.value = filename;
      mosaicoFileSelect.appendChild(opt);
    });
    mosaicoImg.setAttribute("src", `../files/${mosaicoFileSelect.value}`);
  });
}
mosaicoLoadFilenameList();

const mosaicoLoadFolderList = () => {
  axios.get(apiUrl + 'catalogarfolderlist').then(res => {
    const folderNames = res.data;
    const mosaicoFolderSelect = document.querySelector('.mosaico-folder-select');
    mosaicoFolderSelect.innerHTML = '';
    folderNames.forEach(folder => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(folder));
      opt.value = folder;
      mosaicoFolderSelect.appendChild(opt);
    });
  });
}
mosaicoLoadFolderList();

document.querySelector('.mosaico-atualizar-files').addEventListener('click', () => { mosaicoLoadFilenameList(); mosaicoLoadFolderList(); });
document.querySelector('.mosaico-folder-add').addEventListener('click', () => {
  const ref = document.querySelector('.mosaico-folder-select').value;
  if (!mSelectedFolders.includes(ref)) {
    mSelectedFolders.push(ref);
    const newFolderBtn = document.createElement('button');
    newFolderBtn.appendChild(document.createTextNode(ref));
    newFolderBtn.setAttribute("class", "btn btn-danger");
    newFolderBtn.setAttribute("id", `m_${ref}`);
    newFolderBtn.addEventListener('click', () => {
      mSelectedFolders = mSelectedFolders.filter(x => { return x != ref });
      document.getElementById(`m_${ref}`).remove();
    })
    document.querySelector('.mosaico-folders-selecionados').append(newFolderBtn);
  }
});

document.querySelector('.make-mosaico-btn').addEventListener('click', () => {
  if (mx2 > mx1 && my2 > my1 && !!mRows && mSelectedFolders.length) {
    start = new Date().valueOf();
    mosaicoCalcular();
    document.querySelector('.make-mosaico-btn').setAttribute("style", "display: none");
  }
});


const loadModulosDados = async () => {
  return new Promise( (resolve, reject) => {
    axios.post(apiUrl + 'loadmodulosdados', { folders: mSelectedFolders })
      .then(res => { modulosData = res.data; resolve(); })
      .catch(err => { alert(err); reject() })
  })
}

const matchModules = () => {
  selectedModules = [];
  for (let i = 0; i < boxesValues.length; i++) {
    let boxValues = boxesValues[i];
    let distance = 10000000000;
    let bestObjeto = '';
    let bestModuleFilename = '';
    Object.keys(modulosData).forEach(key => {
      const objeto = modulosData[key];
      Object.keys(objeto).forEach(filename => {
        let moduleValues = objeto[filename];
        let dist = distModulos(moduleValues, boxValues);
        if (dist < distance) { distance = dist; bestObjeto = key; bestModuleFilename = filename; }
      })
    })
    selectedModules.push({ bestObjeto, bestModuleFilename });
  }
  console.log(selectedModules);
  setTimeout(() => {
    makeFinalMosaic();
  }, 1000);
}

const dist3D = (x1, y1, z1, x2, y2, z2) => {
  return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1-y2), 2) + Math.pow((z1-z2), 2));
}

const distModulos = (modulo1, modulo2) => {
  let dist = 0;
  for (let i = 0; i < 9; i = i + 3) {
    dist += dist3D(modulo1[i], modulo1[i+1], modulo1[i+2], modulo2[i], modulo2[i+1], modulo2[i+2]);
  }
  return dist;
}

document.querySelector('.mosaico-lado-max').addEventListener('input', () => { rowsInput.value = rowsInput.value.replace(/[^0-9]/g, ''); })
const mColsInput = document.querySelector('.mosaico-cols-input');
const mLadoModuloInput = document.querySelector('.mosaico-lado-modulo-input');
mColsInput.value = 1;
mLadoModuloInput.value = 300;
mColsInput.addEventListener('input', () => { updateMosaicGrid(); });
mColsInput.addEventListener('change', () => { updateMosaicGrid(); });
mLadoModuloInput.addEventListener('input', () => {
  mLadoModuloInput.value = mLadoModuloInput.value.replace(/[^0-9]/g, '');
})


let mCols = 1;
let mRows = 0;
let mGridLado = 0;
let mx1 = 0;
let my1 = 0;
let mx2 = 0;
let my2 = 0;

mosaicoImg.addEventListener('mousedown', (e) => {
  e.preventDefault;
  switch (e.which) {
    case 1:
      const toDel = document.querySelector(".m-dynamic-crop");
      if (toDel) { toDel.remove(); mx1 = 0; my1 = 0; mx2 = 0; my2 = 0; mGridLado = 0; mRows = 0; }
      document.querySelectorAll('.mosaico-box').forEach(x => x.remove());
      mx1 = e.offsetX; my1 = e.offsetY;
      break;
      case 3:
        mx2 = e.offsetX; my2 = e.offsetY;
        updateMosaicGrid();
        break;
      }
    })
    

const updateMosaicGrid = () => {
  const toDel = document.querySelector(".m-dynamic-crop");
  if (toDel) { toDel.remove() };
  document.querySelectorAll('.mosaico-box').forEach(x => x.remove());
  mScaling = mosaicoImg.naturalWidth/mosaicoImg.clientWidth;
  mColsInput.value = mColsInput.value.replace(/[^0-9]/g, ''); mCols = parseInt(mColsInput.value);
  if (!mColsInput.value || !mCols) { mColsInput.value = 1; mCols = 1; }
  if (mLadoModuloInput.value == 0) { mLadoModuloInput.value = 100 };

  if (mx2 > mx1 && my2 > my1) {
    if (toDel) { toDel.remove() }
    const selectionDiv = document.createElement("div");
    selectionDiv.setAttribute("style", `
      position: absolute; z-index: 100; outline: blue 1px solid;
      top: ${my1}px; left: ${mx1}px;
      width: ${mx2 - mx1}px; height: ${my2 - my1}px;
    `);
    selectionDiv.setAttribute("class", `m-dynamic-crop`);
    document.querySelector('.mosaico-img-container').append(selectionDiv);
  } else {
    if (toDel) { toDel.remove() }; x1 = 0; y1 = 0; x2 = 0; y2 = 0; return
  }
  makeMosaicGrid();
}

const makeMosaicGrid = () => {
  mGridLado = (mx2 - mx1)/mCols;
  let rows = Math.floor((my2 - my1)/mGridLado);
  mRows = rows;
  for (let i = 0; i < mCols; i++) {
    for (let j = 0; j < rows; j++) {
      let gridBox = document.createElement("div");
      gridBox.setAttribute("style", `
        position: absolute; z-index: 101; outline: red 1px solid;
        top: ${my1 + j*mGridLado}px; left: ${mx1 + i*mGridLado}px;
        width: ${mGridLado}px; height: ${mGridLado}px;
      `);
      gridBox.setAttribute("class", `mosaico-box`);
      gridBox.setAttribute("id", `m-box-${i}-${j}`);
      document.querySelector('.mosaico-img-container').append(gridBox);
    }
  }
}

document.getElementById('down-mx1').addEventListener('click', () => {
  if (mx2 - mx1 > 2 && mx1 > 0) { mx1 -= 1; updateMosaicGrid() };
});
document.getElementById('down-mx2').addEventListener('click', () => {
  if (mx2 - mx1 > 2) { mx2 -= 1; updateMosaicGrid(); };
});
document.getElementById('down-my1').addEventListener('click', () => {
  if (my2 - my1 > 2) { my1 += 1; updateMosaicGrid(); };
});
document.getElementById('down-my2').addEventListener('click', () => {
  if (my2 - my1 > 2 && my2 < mosaicoImg.clientHeight) { my2 += 1; updateMosaicGrid(); };
});
document.getElementById('up-mx1').addEventListener('click', () => {
  if (mx2 - mx1 > 2) { mx1 += 1; updateMosaicGrid(); };
});
document.getElementById('up-mx2').addEventListener('click', () => {
  if (mx2 - mx1 > 2 && mx2 < mosaicoImg.clientWidth) { mx2 += 1; updateMosaicGrid() };
});
document.getElementById('up-my1').addEventListener('click', () => {
  if (my2 - my1 > 2 && my1 > 0) { my1 -= 1; updateMosaicGrid(); };
});
document.getElementById('up-my2').addEventListener('click', () => {
  if (my2 - my1 > 2) { my2 -= 1; updateMosaicGrid(); };
});

document.getElementById('m-down-cols').addEventListener('click', () => { mColsInput.value = parseInt(mColsInput.value) - 1; mCols = mColsInput.value; updateMosaicGrid(); });
document.getElementById('m-up-cols').addEventListener('click', () => { mColsInput.value = parseInt(mColsInput.value) + 1; mCols = mColsInput.value; updateMosaicGrid(); });


let finalMosaicoSketch;
let mModuloLado;

const makeFinalMosaic = () => {
  mModuloLado = mLadoModuloInput.value;
  if (finalMosaicoSketch) { finalMosaicoSketch.remove() }
  finalMosaicoSketch = new p5(mosaicoFinal, 'final-mosaico-canvas');
  document.querySelector('.make-mosaico-btn').setAttribute("style", "display: inline-block");
}

const mosaicoFinal = (p) => {
  let modulos = [];
  p.preload = () => {
    for (let i = 0; i < selectedModules.length; i++) {
      let modulo = p.loadImage(`../output/modulos/${selectedModules[i]['bestObjeto']}/${selectedModules[i]['bestModuleFilename']}`);
      modulos.push(modulo);
    }
  }
  
  p.setup = () => {
    p.createCanvas(mModuloLado*mCols, mModuloLado*mRows);
  }
  
  p.draw = () => {
    for (let i = 0; i < mRows; i++) {
      for (let j = 0; j < mCols; j++) {
        p.image(modulos[i*mCols + j], j*mModuloLado, i*mModuloLado, mModuloLado, mModuloLado);
      }
    }
    mosaicoMsg.innerHTML = `Pronto! Demorou ${Math.floor((new Date().valueOf() - start)/1000)}s`;
    p.noLoop();
  }
}
