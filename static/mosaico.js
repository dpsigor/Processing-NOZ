let mosaicoImgFilenames;
let mosaicoImg = document.querySelector('.mosaico-img-preview');
let mosaicoSketch;
let mScaling;
let mLadoMax;
document.querySelector('.mosaico-lado-max').value = 10000;
mLadoMax = 10000;
let mSelectedFolders = [];
let modulosData = {};

const sMosaico = (p) => {
  let img;
  p.preload = () => {
    img = p.loadImage(mosaicoImg.getAttribute('src'));
  }

  p.setup = () => {
    p.createCanvas(img.width*mScaling, img.height*mScaling);
  }
  
  p.draw = () => {
    p.background("#FF0000");
    p.image(img, 0, 0, p.width, p.height);
    
    p.noLoop();
  }
}

const makeMosaico = async () => {
  try {
    await loadModulosDados();
    if (mosaicoSketch) { mosaicoSketch.remove() };
    mLadoMax = parseInt(document.querySelector('.mosaico-lado-max').value);
    mScaling = 1;
    if (mosaicoImg.naturalWidth > mosaicoImg.naturalHeight) {
      mScaling = mLadoMax/(mosaicoImg.naturalWidth);
    } else {
      mScaling = mLadoMax/(mosaicoImg.naturalHeight);
    }
    mosaicoSketch = new p5(sMosaico, 'mosaico-canvas');
  } catch (error) {
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
    console.log(mSelectedFolders)
  }
});
document.querySelector('.make-mosaico-btn').addEventListener('click', () => { makeMosaico(); });


const loadModulosDados = async () => {
  return new Promise( (resolve, reject) => {
    if (mSelectedFolders.length) {
      axios.post(apiUrl + 'loadmodulosdados', { folders: mSelectedFolders })
        .then(res => { modulosData = res.data; resolve() })
        .catch(err => { alert(err); reject() })
    }
  })
}