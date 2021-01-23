const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { nextTick } = require('process');

module.exports = (app) => {
  app.post('/api/processing/run', async (req, res) => {
    if (Object.keys(req.body).length == 8) {
      const { previewedFilename, originalWidth, originalHeight, cols, rows, iCols, iRows, flipVertical } = req.body;
      if (!previewedFilename || !originalWidth || !originalHeight || !cols || !rows || !iCols || !iRows) { return res.status(200).send('Inválido') }
      const rootFolder = path.join(__dirname, '..').split(/\/|\\/).join('/');
      const filenameSemExt = previewedFilename.split('.').slice(0, -1).join('.');
      const ext = previewedFilename.split('.').pop();
      const mirrorFilename = rootFolder + '/output/mirror/' + filenameSemExt + '-' + new Date().valueOf() + '.' + ext;
      const filename = rootFolder + '/static/files/' + previewedFilename;
      const normalizedWidth = (Math.floor(originalWidth/(cols*iCols)))*cols*iCols;
      const normalizedHeight = (Math.floor(originalHeight/(rows*iRows)))*rows*iRows;

      // console.log(req.body)
      console.log(`processing-java --sketch=${rootFolder}/static/processing/mirror --run`, filename, mirrorFilename, normalizedWidth, normalizedHeight, cols, rows, iCols, iRows, flipVertical)

      // const child = spawn('processing-java', [
      //   `--sketch=${rootFolder}/static/processing/mirror`,
      //   '--run',
      //   filename,
      //   mirrorFilename,
      //   normalizedWidth,
      //   normalizedHeight,
      //   cols,
      //   rows,
      //   iCols,
      //   iRows,
      //   flipVertical
      // ]);

      // // child.stdout.on('data', (data) => { });
      // child.stderr.setEncoding('utf8');
      // child.stderr.on('data', function (data) {
      //   return res.status(200).send('failed');
      // });

      // child.stdout.on('close', (code) => {
      //   return res.status(200).send('mirror_' + previewedFilename);
      // });
      res.status(200).send('alou')
    } else {
      res.status(200).send('Inválido número de args');
    }
  });

  app.post('/api/processing/crop', async (req, res) => {
    try {
    const rootFolder = path.join(__dirname, '..').split(/\/|\\/).join('/');
    const { filename, x1, y1, x2, y2 } = req.body;
    let newFilename;
    let fullCroppedFilename;
    if (filename.startsWith('cropped_')) {
      let aux = filename.split('_');
      aux.shift();
      aux.shift();
      metFileName = aux.join('_');
      newFilename = 'cropped_' + new Date().valueOf() + '_' + metFileName;
      fullCroppedFilename = path.join(rootFolder, 'static', 'files', newFilename);
    } else {
      newFilename = 'cropped_' + new Date().valueOf() + '_' + filename;
      fullCroppedFilename = path.join(rootFolder, 'static', 'files', newFilename);
    }
    const fullFilename = path.join(rootFolder, 'static', 'files', filename);
      const child = spawn('processing-java', [
        `--sketch=${rootFolder}/static/processing/crop`,
        '--run',
        fullFilename,
        fullCroppedFilename,
        x1,
        y1,
        x2,
        y2,
      ]);
  
      // child.stdout.on('data', (data) => { });
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        return res.status(200).send('Aconteceu um erro.');
      });
  
      child.stdout.on('close', (code) => {
        return res.status(200).send(newFilename);
      });
    } catch (error) {
      return res.status(200).send('Aconteceu um erro.');
    }
  });
};
