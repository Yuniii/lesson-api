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
        var quizJson = [],
            aQuiz = {};

        parser.parseString(data, function(err, result) {
            for (var i = result.project.file.length - 1; i >= 0; i--) {
                var obj = result.project.file[i],
                    name = obj.path[0],
                    content = obj.content[0];

                var title = name.substr(0, name.length - 5),
                    type = name.substr(-5, 5);
                
                if (typeof aQuiz[title] === 'undefined') {
                    aQuiz[title] = {};
                    aQuiz[title].title = title;
                }

                if (type === '.cond') {
                    aQuiz[title].stdout = content;
                }
                else if (type === '.html') {
                    aQuiz[title].description = content;
                }
                else if (type === '.java') {
                    aQuiz[title].ans = content;
                }
                else if (type === '.part') {
                    aQuiz[title].part = content;
                }
            }

            for (var title in aQuiz) {
                quizJson.push(aQuiz[title]);
            }

            res.send(quizJson);
        });
    });
});

app.listen(port);
