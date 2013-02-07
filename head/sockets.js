module.exports = function(socket) {
    socket.emit('update', {
        target: 'serverwidget:update',
        nodes: [
        	{
        		name: 'one',
        		ip: '0.0.0.0'
        	},
        	{
        		name: 'two',
        		ip: '2.2.2.2'
        	}
        ]
    })
}