var express = require('express'),
    xml2js = require('xml2js'),
    fs = require('fs');

var app = new express(),
    port = 8080;

var parser = new xml2js.Parser();

app.get('/:course/:lesson', function(req, res) {
    var path = __dirname + '/xml/' + req.params.course + '/lesson' + req.params.lesson + '.xml';

    fs.readFile(path, function(err, data) {
        if (err !== null) {
            return res.send('no result');
        }
        parser.parseString(data, function(err, result) {
            res.send(result.project.file);
        });
    });
});

app.listen(port);
