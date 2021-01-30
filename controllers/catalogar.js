const fs = require('fs');
const path = require('path');

module.exports = app => {

  app.get('/api/catalogarfolderlist', (req, res) => {
    fs.readdir(path.join(__dirname, '..', 'output', 'modulos'), (err, files) => {
      res.status(200).send(files.filter(file => !file.startsWith('catalogado_')));
    })
  })

  app.post('/api/catalogarfilenames', (req, res) => {
    fs.readdir(path.join(__dirname, '..', 'output', 'modulos', req.body.folder), (err, files) => {
      res.status(200).send(files.filter(file => !file.startsWith('catalogado_')));
    })
  })

}