const express = require('express');

const app = express()
const port = 3456;

app.use(express.static('./static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./controllers/metmuseum')(app);
require('./controllers/processing')(app);
require('./controllers/general')(app);
require('./controllers/fatiar')(app);

app.listen(port, () => { console.log(`App rodando em http://localhost:${port}`) });
