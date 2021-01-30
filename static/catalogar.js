let catFolder;
let catFilenames;
let catSketch;
let catImg;
let fileIndex = 0;
let catalogoObj = {};
let values = [];

let row = 0;
let col = 0;


const catS = (p) => {
  p.setup = () => {
    catImg = p.loadImage('../output/modulos/' + catFolder + '/' + catFilenames[fileIndex], img => {
      p.createCanvas(img.width/3, img.height/3);
    });
    col = 0;
    row = 0;
  }
  
  p.draw = () => {
    p.image(catImg, -col*catImg.width/3, -row*catImg.height/3, catImg.width, catImg.height);
    p.loadPixels();
    let r = 0;
    let g = 0;
    let b = 0;
    for (let i = 0; i < p.pixels.length/4; i++) {
      r += p.pixels[(i+1)*4-4];
      g += p.pixels[(i+1)*4-3];
      b += p.pixels[(i+1)*4-2];
    }
    const avgR = r/(p.pixels.length/4); values.push(parseInt(avgR));
    const avgG = g/(p.pixels.length/4); values.push(parseInt(avgG));
    const avgB = b/(p.pixels.length/4); values.push(parseInt(avgB));
    if (col > 1 && row > 1) {
      p.noLoop();
      col = 0; row = 0;
      catalogoObj[catFilenames[fileIndex]] = [...values];
      console.log(catalogoObj[catFilenames[fileIndex]]);
      values = [];
      fileIndex += 1;
      makeCatSketch();
    }
    else if (row !== 2) { console.log('mandou aumentar o row'); row++ }
    else { col++; row = 0 }
  }
}

const makeCatSketch = () => {
  if (catSketch) { catSketch.remove() };
  if (fileIndex < catFilenames.length) {
    catSketch = new p5(catS, 'catalogar-canvas');
  } else {
    fileIndex = 0;
  }
}

// Select de folders
const loadCatalogFolderList = () => {
  axios.get(apiUrl + 'catalogarfolderlist').then(res => {
    const folderNames = res.data;
    const catalogFileSelect = document.querySelector('.catalogar-file-select');
    catalogFileSelect.innerHTML = '';
    folderNames.forEach(folder => {
      const opt = document.createElement('option');
      opt.appendChild(document.createTextNode(folder));
      opt.value = folder;
      catalogFileSelect.appendChild(opt);
    });
    loadFilenames(catalogFileSelect.value);
    document.querySelector('.catalogar-btn').innerHTML = "Catalogar a pasta " + catalogFileSelect.value;
  });
}
loadCatalogFolderList();

document.querySelector('.catalogar-atualizar-files').addEventListener('click', () => { loadCatalogFolderList(); });
document.querySelector('.catalogar-file-select').addEventListener('change', () => {
  const foldername = document.querySelector('.catalogar-file-select').value;
  document.querySelector('.catalogar-btn').innerHTML = "Catalogar a pasta " + foldername;
  loadFilenames(foldername);
})

const loadFilenames = (foldername) => {
  catFolder = foldername;
  axios.post(apiUrl + 'catalogarfilenames', { folder: foldername }).then(res => { catFilenames = res.data; });
}

document.querySelector('.catalogar-btn').addEventListener('click', () => {
  fileIndex = 0;
  makeCatSketch();
})