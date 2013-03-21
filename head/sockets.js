var zmq = require('zmq')
  , push_socket = zmq.socket('push')
  , pull_socket = zmq.socket('pull');

push_socket.bindSync('tcp://127.0.0.1:5556')
pull_socket.bindSync('tcp://127.0.0.1:5557')
console.log('connected to zeromq');

module.exports = function(socket) {
    var getClients ={
        'getClientList': true
    }
    push_socket.send(JSON.stringify(getClients));
    console.log('sent request to hose')
    
    pull_socket.on('message', function(data) {
        //console.log(zsocket.identity + ': answer data ' + data);
        console.log("Hose message incoming:")
        console.log(JSON.parse(data))
        socket.emit('update', JSON.parse(data))
        /*socket.emit('update', {
            target: 'serverwidget:update',
            nodes: [
                {
                    id: 1,
                    name: 'one',
                    ip: '0.0.0.0',
                    status: 'ready'
                },
                {
                    id: 2,
                    name: 'two',
                    ip: '2.2.2.2',
                    status: 'running'
                },
                {
                    id: 3,
                    name: 'three',
                    ip: '123.222.111.233',
                    status: 'error'
                },
                {
                    id: 4,
                    name: 'four',
                    ip: '123.0.111.233',
                    status: 'ready'
                },
                {
                    id: 5,
                    name: 'five',
                    ip: '123.0.111.233',
                    status: 'ready'
                }
            ]
        })*/
    });
}