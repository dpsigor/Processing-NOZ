const path = require('path');
const { spawn } = require('child_process');

module.exports = app => {

  app.post('/api/fatiar', async (req, res) => {
    const start = new Date().valueOf();
    const { filename, groupname, x1, y1, pixels, cols, rows  } = req.body;
    const rootFolder = path.join(__dirname, '..').split(/\/|\\/).join('/');
    try {
      await fatiar(rootFolder, groupname, filename, x1, y1, pixels, cols, rows);
      console.log('Tempo: ', new Date().valueOf() - start);
      res.status(200).send('aow');
    } catch (error) {
      console.log(error);
      res.status(500).send('falhou');
    }
  });

}

const fatiar = (rootFolder, groupname, filename, x1, y1, pixels, cols, rows) => {
  const inputFilePath = path.join(rootFolder, 'static', 'files', filename).split(/\/|\\/).join('/');
  const outputPath = path.join(rootFolder, 'output', groupname).split(/\/|\\/).join('/');
  console.log(`processing-java --sketch=${rootFolder}/static/processing/fatiar --run ${inputFilePath} ${outputPath} ${x1} ${y1} ${pixels} ${cols} ${rows}`);
  return new Promise ((resolve, reject) => {
    const child = spawn('processing-java', [
      `--sketch=${rootFolder}/static/processing/fatiar`,
      '--run',
      inputFilePath,
      outputPath,
      x1,
      y1,
      pixels,
      cols,
      rows,
    ]);
  
    // child.stdout.on('data', (data) => { });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      console.log(data);
      if (data.includes('heap space')) { reject('Memória insuficiente') };
      reject('failed')
    });
  
    child.stdout.on('close', (code) => {
      resolve('ok');
    });
  })
}