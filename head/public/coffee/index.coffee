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
            
addWidget "serverwidget", ->
    @socket = io.connect()
    @socket.on "update", socketUpdate
    
addWidget "infowidget"
addWidget "jobwidget"
addWidget "clientwidget"

