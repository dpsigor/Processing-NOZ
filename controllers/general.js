const fs = require('fs');
const path = require('path');

module.exports = app => {

  app.get('/api/filelist', (req, res) => {
    fs.readdir(path.join(__dirname, '..', 'static', 'files').split(/\/|\\/).join('/'), (err, files) => {
      jpgFiles = files.filter(filename => !filename.endsWith('txt')).filter(filename => filename.includes('.'));
      res.send(jpgFiles);
    })
  });

}

