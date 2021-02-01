catProgressBarContainer = document.querySelector('.cat-progressbar-container');
catProgressBar = document.querySelector('.cat-progressbar');

let catFolder;
let catFilenames;
let catSketch;
let catalogoObj = {};
let fileIndex = 0;

const catS = (p) => {
  let catImg;
  let row = 0;
  let col = 0;
  let values = [];
  p.preload = () => {
    catImg = p.loadImage('../output/modulos/' + catFolder + '/' + catFilenames[fileIndex]);
  }
  
  p.setup = () => {
    p.createCanvas(catImg.width/3, catImg.height/3);
  }
  
  p.draw = () => {
    p.colorMode(p.HSB, 255);
    p.image(catImg, -catImg.width*col/3, -catImg.height*row/3, catImg.width, catImg.height);
    p.loadPixels();
    let hue = 0;
    let saturation = 0;
    let brightness = 0;
    for (let i = 0; i < p.pixels.length/4; i++) {
      const r = p.pixels[(i+1)*4-4];
      const g = p.pixels[(i+1)*4-3];
      const b = p.pixels[(i+1)*4-2];
      const c = p.color(r, g, b);
      hue += p.floor(p.hue(c));
      saturation += p.saturation(c);
      brightness += p.brightness(c);
    }
    const avgHue = hue/(p.pixels.length/4); values.push(parseInt(avgHue));
    const avgSat = saturation/(p.pixels.length/4); values.push(parseInt(avgSat));
    const avgBrg = brightness/(p.pixels.length/4); values.push(parseInt(avgBrg));
    if (col < 2) { col++ }
    else if (row < 2) { row++; col = 0;}
    else {
      p.noLoop();
      catalogoObj[catFilenames[fileIndex]] = [...values];
      fileIndex += 1;
      makeCatSketch();
    }
  }
}

const makeCatSketch = () => {
  setTimeout(() => {
    if (catSketch) { catSketch.remove() };
    if (fileIndex < catFilenames.length) {
      catProgressBarContainer.setAttribute("style", "display: block");
      updateCatProgressBar();
      catSketch = new p5(catS, 'catalogar-canvas');
    } else {
      if (catSketch) { catSketch.remove() };
      closeCatProgressBar();
      fileIndex = 0;
      saveCatDados();
    }
  }, 1);
}

document.querySelector('.catalogar-btn').addEventListener('click', () => {
  fileIndex = 0;
  makeCatSketch();
  document.querySelector('.catalogar-btn').setAttribute('style', 'display: none');
})

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

const saveCatDados = () => {
  axios.post(apiUrl + 'savecatalogo', { folder: catFolder, info: catalogoObj })
  .then(res => {
    document.querySelector('.catalogar-btn').setAttribute('style', 'display: inline-block');
    console.log(res.data);
  })
  .catch(err => {
    document.querySelector('.catalogar-btn').setAttribute('style', 'display: inline-block');
    alert(err);
    });
}

const updateCatProgressBar = () => {
  catProgressBar.setAttribute("style", `width: ${fileIndex*100/(catFilenames.length - 1)}%`);
}

const closeCatProgressBar = () => {catProgressBarContainer.setAttribute("style", "display: none");
  catProgressBar.setAttribute("style", `width: 0%`);
}