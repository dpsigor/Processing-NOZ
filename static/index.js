const apiUrl = 'http://localhost:3456/api/';

const routeProcessingBtn = document.querySelector('.routerprocessing');
const processingContainer = document.querySelector('.processingContainer');
const routeDownloaderBtn = document.querySelector('.routerdownloader');
const botContainer = document.querySelector('.botContainer');
const routeFatiarBtn = document.querySelector('.routerfatiar');
const fatiarContainer = document.querySelector('.fatiarContainer');
const routeCatalogarBtn = document.querySelector('.routercatalogar');
const catalogarContainer = document.querySelector('.catalogarContainer');
const routeMosaicoBtn = document.querySelector('.routermosaico');
const mosaicoContainer = document.querySelector('.mosaicoContainer');

routeProcessingBtn.addEventListener('click', () => onRouteProcessing());
routeDownloaderBtn.addEventListener('click', () => onRouteDownloader());
routeFatiarBtn.addEventListener('click', () => onRouteFatiar());
routeCatalogarBtn.addEventListener('click', () => onRouteCatalogar());
routeMosaicoBtn.addEventListener('click', () => onRouteMosaico());

// Router
const onRouteProcessing = () => {
  baseRouting();
  routeProcessingBtn.setAttribute("class", "btn btn-primary routerprocessing");
  processingContainer.setAttribute("style", "display: grid");
}
const onRouteDownloader = () => {
  baseRouting();
  routeDownloaderBtn.setAttribute("class", "btn btn-primary routerdownloader");
  botContainer.setAttribute("style", "display: grid");
}
const onRouteFatiar = () => {
  baseRouting();
  routeFatiarBtn.setAttribute("class", "btn btn-primary routerfatiar");
  fatiarContainer.setAttribute("style", "display: grid");
}
const onRouteCatalogar = () => {
  baseRouting();
  routeCatalogarBtn.setAttribute("class", "btn btn-primary routercatalogar");
  catalogarContainer.setAttribute("style", "display: grid");
}
const onRouteMosaico = () => {
  baseRouting();
  routeMosaicoBtn.setAttribute("class", "btn btn-primary routermosaico");
  mosaicoContainer.setAttribute("style", "display: grid");
}
const baseRouting = () => {
  routeProcessingBtn.setAttribute("class", "btn btn-secondary routerprocessing");
  processingContainer.setAttribute("style", "display: none");
  routeFatiarBtn.setAttribute("class", "btn btn-secondary routerprocessing");
  fatiarContainer.setAttribute("style", "display: none");
  routeCatalogarBtn.setAttribute("class", "btn btn-secondary routercatalogar");
  catalogarContainer.setAttribute("style", "display: none");
  routeMosaicoBtn.setAttribute("class", "btn btn-secondary routermosaico");
  mosaicoContainer.setAttribute("style", "display: none");
  routeDownloaderBtn.setAttribute("class", "btn btn-secondary routerdownloader");
  botContainer.setAttribute("style", "display: none");
}