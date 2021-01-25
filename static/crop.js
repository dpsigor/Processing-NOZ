const cropBtn = document.querySelector('.crop-btn');
const loadingCropBtn = document.querySelector('.loading-crop-btn');
cropBtn.addEventListener('click', () => onCropImg());

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;

imgPreview.addEventListener('mousedown', (e) => {
  e.preventDefault;
  switch (e.which) {
    case 1:
      const toDel = document.querySelector(".dynamic-crop");
      if (toDel) { toDel.remove(); x1 = 0; y1 = 0; x2 = 0; y2 = 0 }
      x1 = e.offsetX; y1 = e.offsetY;
      break;
    case 3:
      x2 = e.offsetX; y2 = e.offsetY;
      if (x2 > x1 && y2 > y1) {
        const toDel = document.querySelector(".dynamic-crop");
        if (toDel) { toDel.remove() }
        const selectionDiv = document.createElement("div");
        selectionDiv.setAttribute("style", `
          position: absolute; z-index: 100; outline: red 1px solid;
          top: ${y1}px; left: ${x1}px;
          width: ${x2 - x1}px; height: ${y2 - y1}px;
        `);
        selectionDiv.setAttribute("class", `dynamic-crop`);
        imgContainer.append(selectionDiv);
      } else { toDel.remove(); x1 = 0; y1 = 0; x2 = 0; y2 = 0 }
      break;
  }
})


const onCropImg = () => {
  if (x2 - x1 < 1) { alert('Selecione área de crop'); return }
  if (y2 - y1 < 1) { alert('Selecione área de crop'); return }
  let APIx1 = Math.round(x1*imgPreview.naturalWidth/imgPreview.clientWidth);
  let APIy1 = Math.round(y1*imgPreview.naturalHeight/imgPreview.clientHeight);
  let APIx2 = Math.round(x2*imgPreview.naturalWidth/imgPreview.clientWidth);
  let APIy2 = Math.round(y2*imgPreview.naturalHeight/imgPreview.clientHeight);
  cropBtn.setAttribute("style", "display: none");
  loadingCropBtn.setAttribute("style", "display: block");
  // processingContainer.setAttribute("style", "display: none");
  // loadingContainer.setAttribute("style", "display: grid");
  const fileSelect = document.querySelector('.file-select');
  const filename = fileSelect.value;
  axios.post(apiUrl + 'processing/crop', {
    filename: filename,
    x1: APIx1,
    y1: APIy1,
    x2: APIx2,
    y2: APIy2,
  }).then((res) => {
    loadingCropBtn.setAttribute("style", "display: none");
    cropBtn.setAttribute("style", "display: block");
    const newFilename = res.data;
    const opt = document.createElement('option');
    opt.appendChild(document.createTextNode(newFilename));
    opt.value = newFilename;
    fileSelect.appendChild(opt);
    fileSelect.value = newFilename;
    fileSelect.value = newFilename;
    imgPreview.setAttribute("src", `files/${newFilename}`);
    document.querySelector(".dynamic-crop").remove();
    processingContainer.setAttribute("style", "display: block");
    loadingContainer.setAttribute("style", "display: none");
    x1 = 0; y1 = 0; x2 = 0; y2 = 0;
  }).catch(err => {
    console.log(err);
    loadingCropBtn.setAttribute("style", "display: none");
    cropBtn.setAttribute("style", "display: block");
  });
}