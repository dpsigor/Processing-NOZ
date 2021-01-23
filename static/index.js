const apiUrl = 'http://localhost:3456/api/';

let ids = [];
let objsData = [];
let nTotal = 0;
let nImagens = 0;
let nBaixados = 0;
let nFilesEmDisco = 0;
let terminouObjsData = false;
let iniciouDownloads = false;
let query = '';
let interrompeu = false;

const informacoesEl = document.querySelector('.informacoes');
const queryInput = document.querySelector('#query-input');
const statusMsgDiv = document.querySelector('.status-msg');
const nomesListaUl = document.getElementById('nomes');
const baixadosDiv = document.querySelector('.baixados');
const nObjetosDiv = document.querySelector('.n-objetos');
const nImagensDiv = document.querySelector('.n-imagens');
const progressBarContainer = document.querySelector('.progressbar-container');
const progressBar = document.querySelector('.progressbar');
const startBtn = document.querySelector('.start-btn');
const abortBtn = document.querySelector('.abort-btn');
// const runBtn = document.querySelector('.run-process');
const routeProcessingBtn = document.querySelector('.routerprocessing');
const routeDownloaderBtn = document.querySelector('.routerdownloader');
const processingContainer = document.querySelector('.processingContainer');
const loadingContainer = document.querySelector('.loading');
const botContainer = document.querySelector('.botContainer');
const imgContainer = document.querySelector('.img-container');
const imgPreview = document.querySelector('.img-preview');
const colsInput = document.querySelector('.cols-input');
const rowsInput = document.querySelector('.rows-input');
const icolsInput = document.querySelector('.icols-input');
const irowsInput = document.querySelector('.irows-input');

queryInput.value = 'sunflowers';

function onStart(queryValue) {
  interrompeu = false;
  ids = [];
  objsData = [];
  nTotal = 0;
  nImagens = 0;
  nBaixados = 0;
  terminouObjsData = false;
  iniciouDownloads = false;
  informacoesEl.innerHTML = `Pasta destino das imagens: ./static/files`;
  progressBarContainer.setAttribute("style", "display: block");
  progressBar.setAttribute("style", `width: 0%`);
  statusMsgDiv.innerHTML = '';
  nObjetosDiv.innerHTML = '';
  nImagensDiv.innerHTML = '';
  baixadosDiv.innerHTML = '';
  nomesListaUl.innerHTML = '';
  startBtn.setAttribute("style", "display: none");
  abortBtn.setAttribute("style", "display: block");

  axios
    .get(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&tags=true&q=${queryValue}`
    )
    .then(function (response) {
      nObjetosUpdate(response.data.total);
      ids.push(...response.data.objectIDs);
      statusMsgDiv.innerHTML = 'Carregando dados e salvando imagens...';
      if (!interrompeu) { getObjects(); }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function getObjects() {
  if (ids.length) {
    const id = ids[0];
    axios
      .get(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
      )
      .then(function (response) {
        listarNome(response.data.title);
        objsData.push(response.data);
        if (!iniciouDownloads) { iniciouDownloads = true; onDownload() };
        ids.shift();
        getObjects();
        updateNumImagens(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    terminouObjsData = true;
    nImagensDiv.innerHTML = `Total de imagens a baixar: ${nImagens}`;
  }
}

const listarNome = (title) => {
  const nomeItemEl = document.createElement('li');
  nomeItemEl.innerHTML = title;
  nomesListaUl.appendChild(nomeItemEl);
};

const onDownload = () => {
  if (objsData.length) {
    axios
    .post(apiUrl + 'metmuseum/downloadOne', { objData: objsData[0] })
    .then((res) => {
      objsData.shift();
      updateNumBaixados();
      updateProgressBar();
      if (!interrompeu) { onDownload(); } else { statusMsgDiv.innerHTML = 'Downloads interrompidos com sucesso. Para voltar ao início, atualize a página (F5).' }
    });
  } else if (!terminouObjsData) {
    setTimeout(() => { onDownload(); }, 5000);
  } else {
    statusMsgDiv.innerHTML = 'Fim!';
    startBtn.innerHTML = 'Iniciar novo download'
    startBtn.setAttribute("style", "display: block");
    abortBtn.setAttribute("style", "display: none");
  }
};

const updateNumBaixados = () => {
  nBaixados++;
  baixadosDiv.innerHTML = `Realizou o download das imagens de ${nBaixados} objetos. Objetos restantes: ${nTotal - nBaixados}`;
}

const updateProgressBar = () => {
  progressBar.setAttribute("style", `width: ${nBaixados*100/nTotal}%`);
}

const nObjetosUpdate = (n) => {
  nTotal = n;
  nObjetosDiv.innerHTML =
    'Objetos encontrados: ' + n;
};

const updateNumImagens = (objData) => {
  if (objData.additionalImages.length) { nImagens = nImagens + 1 + objData.additionalImages.length; }
  else { nImagens += 1; }
  nImagensDiv.innerHTML = `Total de imagens a baixar: ${nImagens} e contando...`;
}

const onInterromper = () => {
  statusMsgDiv.innerHTML="Cancelando os downloads seguintes...";
  abortBtn.innerHTML="Processo cancelado pelo usuário!";
  interrompeu = true;
}

// const onProcess = () => {
//   axios.get(apiUrl + 'processing/run')
//     .then(res => console.log(res));
// }

startBtn.addEventListener('click', () => { query = queryInput.value; onStart(query) });
abortBtn.addEventListener('click', () => { onInterromper() });
// runBtn.addEventListener('click', () => { onProcess() });
routeProcessingBtn.addEventListener('click', () => onRouteProcessing());
routeDownloaderBtn.addEventListener('click', () => onRouteDownloader());
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

// Select de files
document.querySelector('.atualizar-files').addEventListener('click', () => {
  axios.get(apiUrl + 'filelist').then(res => {
    const imgFilenames = res.data;
    nFilesEmDisco = imgFilenames.length;
    const fileSelect = document.querySelector('.file-select');
    fileSelect.innerHTML = '';
    fileSelect.addEventListener('change', () => { imgPreview.setAttribute("src", `../files/${fileSelect.value}`); })
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


// Router
const onRouteProcessing = () => {
  routeProcessingBtn.setAttribute("class", "btn btn-primary routerprocessing");
  routeDownloaderBtn.setAttribute("class", "btn btn-secondary routerdownloader");
  processingContainer.setAttribute("style", "display: grid");
  botContainer.setAttribute("style", "display: none");
}
const onRouteDownloader = () => {
  routeProcessingBtn.setAttribute("class", "btn btn-secondary routerprocessing");
  routeDownloaderBtn.setAttribute("class", "btn btn-primary routerdownloader");
  processingContainer.setAttribute("style", "display: none");
  botContainer.setAttribute("style", "display: grid");
}
