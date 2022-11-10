const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser');
const endStackHandler = require('./errorUtil/endStackHandler')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes)
app.use(endStackHandler)

console.log('Server Started')
app.listen(3001)