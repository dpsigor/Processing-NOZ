const path = require('path');

module.exports = app => {

  app.post('/api/fatiar', async (req, res) => {
    const { filename, x1, y1, pixels, cols, rows  } = req.body;
    const rootFolder = path.join(__dirname, '..').split(/\/|\\/).join('/');
    await fatiar(rootFolder, filename, x1, y1, pixels, cols, rows);
    res.send('aow');
  });

}

const fatiar = (rootFolder, filename, x1, y1, pixels, cols, rows) => {
  const inputFilePath = path.join(rootFolder, 'static', 'files', filename);
  const outputPath = path.join(rootFolder, 'output', `${new Date().valueOf()}_${filename.split('.').slice(0, -1).join('.')}`);

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