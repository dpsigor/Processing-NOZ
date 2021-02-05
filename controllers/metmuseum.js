const path = require('path');
const fs = require('fs');
const { downloadFile } = require('../utils/downloadfile');
const { saveInfo } = require('../utils/saveinfo');

module.exports = app => {
  app.post('/api/metmuseum/downloadOne', async (req, res) => {
    const imgUrls = [];
    imgUrls.push(req.body.objData.primaryImage);
    imgUrls.push(...req.body.objData.additionalImages);
    
    if (!fs.existsSync(path.join(__dirname, '..', 'static', 'files'))) { fs.mkdir(path.join(__dirname, '..', 'static', 'files')) }
    const dir = path.join(__dirname, '..', 'static', 'files').split(/\/|\\/).join('/');
    
    let i = 0;
    for (const imgUrl of imgUrls) {
      const filename = req.body.objData.objectID + '_' + i.toString();
      const ext = '.' + imgUrl.split('.').pop().toLowerCase();
      if (!fs.existsSync(dir)) { fs.mkdirSync(dir) };
      console.log(`Baixando ${filename}. ${i} de ${imgUrls.length}`)
      await downloadFile(imgUrl, dir + '/' + filename + ext);
      i++;
    }
    
    saveInfo(dir, req.body.objData.objectID, req.body.objData);
    res.send(`Baixou ${req.body.objData.objectID}`)
  });
}