@loadTemplate =  (name, callback) ->
    $.get "/views/#{name}.dust", (data) ->
        callback
            data : data
            name : name

@events = _.clone Backbone.Events

widgets =
    serverwidget :
        model: Sprinkler.ServersWidget
        view: Sprinkler.ServersWidgetView
    infowidget :
        model: Sprinkler.InfoWidget
        view: Sprinkler.InfoWidgetView
    jobwidget :
        model: Sprinkler.JobWidget
        view: Sprinkler.JobWidgetView
    clientwidget :
        model: Sprinkler.ClientWidget
        view: Sprinkler.ClientWidgetView

@widgetList = []

addWidget = (name, callback) ->
    el = $('<div/>').appendTo('#mainBox')
    loadTemplate name , (data) ->
        widgetList.push new widgets[name].view new widgets[name].model,data,el
        callback() if callback

socketUpdate = (data) ->
    console.log data
    if not typeof data.success == 'undefined'
        console.error data.error
    if data.updateClient
        events.trigger 'serverwidget:updateClient', data.updateClient
    if data.clientList
        events.trigger 'serverwidget:updateList', data.clientList
    if data.clientJobs
        events.trigget 'infowidget:clientJobs', data.clientJobs
    if data.clientCurrentJob
        events.trigger 'infowidget:clientCurrentJob', data.clientCurrentJob
    if data.publicKey
        events.trigger 'clientwidget:publicKey', data.publicKey

@socket = io.connect()
@socket.on "update", socketUpdate

addWidget "serverwidget", ->
    getClientList()

addWidget "infowidget"
addWidget "jobwidget"
addWidget "clientwidget"

sendSocket = (label, obj) ->
    socketObj = {}
    socketObj[label] = obj
    @socket.emit 'message', socketObj

createClient = (name, hostname, sshUser, publicKey, sshPassword, rootPassword) ->
    clientObj = 
         name: name,
         hostname: hostname,
         sshUser: sshUser
    if publicKey
        clientObj.publicKey = true
    if sshPassword
        clientObj.sshPassword = sshPassword
    if rootPassword
        clientObj.rootPassword = rootPassword
    sendSocket 'newClient', clientObj
        
createJob = (name, clientId, command) ->
    sendSocket 'newJob',
        name: name,
        clientId: clientId,
        command: command

commandObj = (dir, user, sh) ->
    return {
        dir: dir,
        user: user,
        sh: sh
    }

removeJob = (jobId) ->
    sendSocket 'removeJob',
        id: jobId
    
removeClient = (clientId) ->
    sendSocket 'removeClient', clientId

getClientList = ->
    sendSocket 'getClientList', {}
    
getClientJobs = (clientId) ->
    sendSocket 'getClientJobs', 
        id: clientId
    
getClientCurrentJob = (clientId) ->
    sendSocket 'getClientCurrentJob',
        id: clientId

getPublicKey = ->
    sendSocket 'getPublicKey', {}

events.on "createClient", createClient.bind @
events.on "createJob", createJob.bind @
events.on "commandObj", commandObj.bind @
events.on "removeJob", removeJob.bind @
events.on "removeClient", removeClient.bind @
events.on "getClientJobs", getClientJobs.bind @
events.on "getClientCurrentJob", getClientCurrentJob.bind @
events.on "getPublicKey", getPublicKey.bind @
