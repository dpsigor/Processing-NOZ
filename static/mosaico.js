let mosaicoImg = document.querySelector('.mosaico-img-preview');
const mosaicoMsg = document.querySelector('.mosaico-msg');

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
let pg;

let start;

const mLerOriginal = (p) => {
  let img;
  p.preload = () => {
    img = p.loadImage(mosaicoImg.getAttribute('src'));
  }
  
  p.setup = () => {
    p.createCanvas(img.width*mScaling, img.height*mScaling);
    mosaicoMsg.innerHTML = '';
  }
  
  p.draw = () => {
    p.background("#FF0000");
    p.image(img, 0, 0, p.width, p.height);
    boxesValues = [];
    let lado = p.floor(300 * mScaling); // TODO: AQUI ESTÁ CONSIDERANDO lado do módulo fixo em 300
    
    for (let i = 0; i < Math.floor(p.height/(lado)); i++) {
      for (let j = 0; j < Math.floor(p.width/(lado)); j++) {
        let box = p.get(j * lado, i * lado, lado, lado);
        let values = [];
        for (let m = 0; m < 3; m++) {
          for (let n = 0; n < 3; n++) {
            if (pg) { pg.remove() }
            pg = p.createGraphics(lado/3, lado/3); 
            pg.image(box, -lado*n/3, -lado*m/3, lado, lado);
            pg.loadPixels();
            let hue = 0;
            let saturation = 0;
            let brightness = 0;
            for (let i = 0; i < pg.pixels.length/4; i++) {
              const r = pg.pixels[(i+1)*4-4];
              const g = pg.pixels[(i+1)*4-3];
              const b = pg.pixels[(i+1)*4-2];
              const c = p.color(r, g, b);
              hue += p.floor(p.hue(c));
              saturation += p.saturation(c);
              brightness += p.brightness(c);
            }
            const avgHue = hue/(pg.pixels.length/4); values.push(parseInt(avgHue));
            const avgSat = saturation/(pg.pixels.length/4); values.push(parseInt(avgSat));
            const avgBrg = brightness/(pg.pixels.length/4); values.push(parseInt(avgBrg));
          }
        }
        boxesValues.push([...values]);
        
        p.push();
        p.translate(j*lado, i*lado);
        p.rect(lado/2 - 2.5, lado/2 - 2.5, 5, 5);
        p.pop();
      }
      console.log(`${i+1} 'de' ${Math.floor(p.height/(lado))}`);
    }
    mosaicoMsg.innerHTML = `Leu a imagem, com scaling ${Math.floor(mScaling*100)}%, em ${Math.floor((new Date().valueOf() - start)/1000)}s. Agora está fazendo match dos módulos...`;
    matchModules();
    p.noLoop();
  }
}

const makeMosaico = async () => {
  try {
    await loadModulosDados();
    if (mosaicoSketch) { mosaicoSketch.remove() };
    mLadoMax = parseInt(document.querySelector('.mosaico-lado-max').value);
    mScaling = 1;
    if (mosaicoImg.naturalWidth > mosaicoImg.naturalHeight && mosaicoImg.naturalWidth > mLadoMax) {
      mScaling = mLadoMax/(mosaicoImg.naturalWidth);
    } else if (mosaicoImg.naturalHeight > mosaicoImg.naturalWidth && mosaicoImg.naturalHeight > mLadoMax) {
      mScaling = mLadoMax/(mosaicoImg.naturalHeight);
    }
    mosaicoSketch = new p5(mLerOriginal, 'mosaico-canvas');
  } catch (error) {
    console.log(error);
    alert('Ocorreu um erro (makeMosaico)')
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
  start = new Date().valueOf();
  makeMosaico();
  document.querySelector('.make-mosaico-btn').setAttribute("style", "display: none");
});


const loadModulosDados = async () => {
  return new Promise( (resolve, reject) => {
    if (mSelectedFolders.length) {
      axios.post(apiUrl + 'loadmodulosdados', { folders: mSelectedFolders })
        .then(res => { modulosData = res.data; resolve(); })
        .catch(err => { alert(err); reject() })
    }
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
  setTimeout(() => {
    makeFinalMosaic();
  }, 100);
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

const makeFinalMosaic = () => {
  if (mosaicoSketch) { mosaicoSketch.remove() };
  mosaicoSketch = new p5(makeMosaicoSketch, 'mosaico-canvas');
  document.querySelector('.make-mosaico-btn').setAttribute("style", "display: inline-block");
}

const makeMosaicoSketch = (p) => {
  let img;
  let modulos = [];
  p.preload = () => {
    for (let i = 0; i < selectedModules.length; i++) {
      let modulo = p.loadImage(`../output/modulos/${selectedModules[i]['bestObjeto']}/${selectedModules[i]['bestModuleFilename']}`);
      modulos.push(modulo);
    }
    img = p.loadImage(mosaicoImg.getAttribute('src'));
  }
  
  p.setup = () => {
    p.createCanvas(img.width*mScaling, img.height*mScaling);
  }
  
  p.draw = () => {
    let lado = 300 * mScaling; // TODO: LADO ESTÁ FIXO COM 300px...
    let rows = Math.floor(p.height/(lado));
    let cols = Math.floor(p.width/(lado));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        p.image(modulos[i*cols + j], j*lado, i*lado, lado, lado);
      }
    }
    mosaicoMsg.innerHTML = `Pronto! Demorou ${Math.floor((new Date().valueOf() - start)/1000)}s`;
    p.noLoop();
  }
}