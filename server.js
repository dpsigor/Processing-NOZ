const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express()
const port = 3456;

app.use('/', express.static('./static'));
app.use('/output', express.static('./output'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./controllers/metmuseum')(app);
require('./controllers/general')(app);
require('./controllers/fatiar')(app);
require('./controllers/catalogar')(app);

app.listen(port, () => {
	console.log(`App rodando em http://localhost:${port}`);
	if (!fs.existsSync(path.join(__dirname, 'static', 'files'))) { fs.mkdirSync(path.join(__dirname, 'static', 'files')) };
	if (!fs.existsSync(path.join(__dirname, 'output'))) { fs.mkdirSync(path.join(__dirname, 'output')) };
	if (!fs.existsSync(path.join(__dirname, 'output', 'modulos'))) { console.log('??????'); fs.mkdirSync(path.join(__dirname, 'output', 'modulos')) };
});
