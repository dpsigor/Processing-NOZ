const fs = require('fs');
const path = require('path');

exports.saveInfo = (dir, filename, objData) => {
  fs.writeFileSync(
    path.join(dir, filename + '.txt'),
    `${JSON.stringify(objData)}`,
    'utf-8'
  );
}