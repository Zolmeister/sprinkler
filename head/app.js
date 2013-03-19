/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    cons = require('consolidate'),
    uuid = require('node-uuid'),
    socketConnection = require('./sockets'),
    stylus = require('stylus'),
    nib = require('nib');

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
    app.use(stylus.middleware({
        src: __dirname + '/public',
        compile: compile
    }))
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    app.use(app.router)
    app.use(express.static(path.join(__dirname, 'public')))
})

app.configure('development', function() {
    app.use(express.errorHandler())
})

app.get('/', routes.index)
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

function compile(str, path) {
    console.log("COMPILE")
    console.log(path)
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

var server = http.createServer(app)

var io = require('socket.io').listen(server)
io.sockets.on('connection', socketConnection)

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'))
})
