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
      const outputPath = rootFolder + '/output/mirror/' + filenameSemExt + '/_' + new Date().valueOf() + '/';
      const inputFilename = rootFolder + '/static/files/' + previewedFilename;
      const squareW = Math.floor(originalWidth/cols);
      const squareH = Math.floor(originalHeight/rows);
      const moduleW = squareW*iCols;
      const moduleH = squareH*iRows;
      const canvasW = moduleW > originalWidth ? moduleW : originalWidth;
      const canvasH = moduleH > originalHeight ? moduleH : originalHeight;

      // const finalWidth = Math.floor(originalWidth/cols)*cols * iCols;
      // const finalHeight = Math.floor(originalHeight/rows)*rows * iRows;

      console.log(`processing-java --sketch=${rootFolder}/static/processing/mirror --run`, inputFilename, outputPath, filenameSemExt, canvasW, canvasH, cols, rows, iCols, iRows, flipVertical)

      const child = spawn('processing-java', [
        `--sketch=${rootFolder}/static/processing/mirror`,
        '--run',
        inputFilename,
        outputPath,
        filenameSemExt,
        canvasW,
        canvasH,
        cols,
        rows,
        iCols,
        iRows,
        flipVertical
      ]);

      // child.stdout.on('data', (data) => { });
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', function (data) {
        console.log(data);
        if (data.includes('heap space')) { return res.status(200).send('Memória insuficiente') };
        return res.status(200).send('failed');
      });

      child.stdout.on('close', (code) => {
        return res.status(200).send('ok');
      });
      // res.status(200).send('alou')
    } else {
      return res.status(200).send('Inválido número de args');
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
