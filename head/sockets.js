var zmq = require('zmq')
  , push_socket = zmq.socket('push')
  , pull_socket = zmq.socket('pull');

push_socket.connect('tcp://127.0.0.1:5556')
pull_socket.connect('tcp://127.0.0.1:5557')
console.log('connected to zeromq');

module.exports = function(socket) {
    
    pull_socket.on('message', function(data) {
        //console.log(zsocket.identity + ': answer data ' + data);
        console.log("Hose message incoming:")
        console.log(JSON.parse(data))
        socket.emit('update', JSON.parse(data))
    });
    
    function send(obj){
        console.log(JSON.stringify(obj))
        push_socket.send(JSON.stringify(obj));
    }
    
    socket.on('message', send);
    
}
