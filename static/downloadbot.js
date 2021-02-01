const startBtn = document.querySelector('.start-btn');
const informacoesEl = document.querySelector('.informacoes');
const queryInput = document.querySelector('#query-input');
const statusMsgDiv = document.querySelector('.status-msg');
const nomesListaUl = document.getElementById('nomes');
const baixadosDiv = document.querySelector('.baixados');
const nObjetosDiv = document.querySelector('.n-objetos');
const nImagensDiv = document.querySelector('.n-imagens');
const progressBarContainer = document.querySelector('.progressbar-container');
const progressBar = document.querySelector('.progressbar');
const abortBtn = document.querySelector('.abort-btn');

queryInput.value = 'sunflowers';

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
      if (nTotal > 0) {
        ids.push(...response.data.objectIDs);
        statusMsgDiv.innerHTML = 'Carregando dados e salvando imagens...';
        if (!interrompeu) { getObjects(); }
      } else {
        startBtn.setAttribute("style", "display: block");
        abortBtn.setAttribute("style", "display: none");
        progressBarContainer.setAttribute("style", "display: none");
      }
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


startBtn.addEventListener('click', () => { query = queryInput.value; onStart(query) });
abortBtn.addEventListener('click', () => { onInterromper() });
