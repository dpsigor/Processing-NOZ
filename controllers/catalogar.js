const fs = require('fs');
const path = require('path');

module.exports = app => {

  app.get('/api/catalogarfolderlist', (req, res) => {
    fs.readdir(path.join(__dirname, '..', 'output', 'modulos'), (err, files) => {
      res.status(200).send(files);
    })
  })

  app.post('/api/catalogarfilenames', (req, res) => {
    fs.readdir(path.join(__dirname, '..', 'output', 'modulos', req.body.folder), (err, files) => {
      res.status(200).send(files);
    })
  })

  app.post('/api/savecatalogo', (req, res) => {
    const folder = req.body.folder;
    const info = JSON.stringify(req.body.info, null, 2);
    fs.writeFile(path.join(__dirname, '..', 'output', 'modulos', folder, 'data.txt'), info, { encoding: 'utf-8' }, () => {
      res.status(200).send('ok');
    });
  })

  app.post('/api/loadmodulosdados', (req, res) => {
    const folders = req.body.folders;
    const dados = {};
    folders.forEach(folder => {
      const info = fs.readFileSync(path.join(__dirname, '..', 'output', 'modulos', folder, 'data.txt'), { encoding: 'utf-8' });
      dados[folder] = JSON.parse(info);
    })
    res.status(200).send(dados)
  })

}