/**
 * Very basic server to serve our index.html, assets, and mock json files
 */
var express = require('express');
var app = express();
var path = require("path");

app.use(express.static('public'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/event', function (req, res) {
	res.sendFile(path.join(__dirname + '/sampleEvent.1.json'));
});
app.post('/event', function (req, res) {
	res.sendFile(path.join(__dirname + '/sampleEvent.json'));
});

app.get('/filter', function (req, res) {
	res.sendFile(path.join(__dirname + '/sampleFilter.json'));
});

app.post('/filter', function (req, res) {
	res.sendFile(path.join(__dirname + '/sampleFilter.json'));
});

app.listen(3000, function () {
	console.log('Server  listening on port 3000!');
});