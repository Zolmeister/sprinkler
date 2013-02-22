module.exports = function(socket) {
    socket.emit('update', {
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
    })
}