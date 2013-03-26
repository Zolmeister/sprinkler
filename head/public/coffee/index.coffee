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
    if data.clientList
        events.trigger 'serverwidget:update', data.clientList
            

@socket = io.connect()
@socket.on "update", socketUpdate

addWidget "serverwidget", ->
    @socket.emit 'getClientList'

addWidget "infowidget"
addWidget "jobwidget"
addWidget "clientwidget"

createClient = (name, hostname, def, ssh_user, ssh_pw, root_pw) ->
    @socket.emit 'createClient',
            "name": name
            "hostname": hostname
            "default": def
            "ssh_user": ssh_user
            "ssh_pw": ssh_pw
            "root_pw": root_pw
        
        
        
events.on "createClient", createClient.bind @
        