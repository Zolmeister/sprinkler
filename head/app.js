/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    rabbit = require('rabbit.js').createContext(),
    uuid = require('node-uuid')

    var app = express()
app.engine('dust', cons.dust)
app.configure(function() {
    app.set('port', process.env.PORT || 3000)
    app.set('views', __dirname + '/views')
    app.set('view engine', 'dust') //dust.js default
    app.set('view options', {
        layout: false
    }); //disable layout default
    app.locals({
        layout: false
    })
    app.use(express.logger('dev'))
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function() {
    app.use(express.errorHandler())
})

app.get('/', routes.index);
app.get('/test', function(req, res) {
    var q = req.param('q', "")
    var uuid = uuid.v4()

    pub.write(JSON.stringify({
        uuid: uuid,
        req: "test"
    }), 'utf8')

    queue[uuid] = function(data) {
            res.render('index', {
                q: data
            })
        }
})

var queue = {}

function respQueue(uuid, data) {
    if (queue[uuid]) {
        queue[uuid](data)
        queue[uuid] = undefined
    }
}

rabbit.on('ready', function() {
    pub = rabbit.socket('PUB')
    sub = rabbit.socket('SUB')
    sub.pipe(process.stdout)
    sub.connect('reply_queue')
    sub.setEncoding('utf8')
    sub.on('data', function(data) {
        var data = JSON.parse(data)
        console.log("got data: "+data)
        respQueue(data.uuid, data.resp)
    });
    pub.connect('request_queue')
})

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'))
})
setTimeout(function(){
console.log("writing to pub")
 pub.write(JSON.stringify({
        uuid: uuid.v4(),
        req: "test"
    }), 'utf8')

},2000)
