var express = require('express'),
    app = express();

app.use(express.static(__dirname + '/public'));

app.listen(7777);

console.log('Server running at http://127.0.0.1:7777/');