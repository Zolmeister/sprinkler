@loadTemplate =  (name, callback) ->
	$.get "/views/#{name}.dust", (data) ->
		callback 
			data : data
			name : name

@events = _.clone Backbone.Events

class Widget extends Backbone.Model

class WidgetView extends Backbone.View
	initialize:(model, template, el) ->
		@self = @
		@model = model
		@$el = el
		@template = template
		dust.loadSource dust.compile template.data,template.name
	render: (options, callback)->
		template = (err, res)->
			@$el.html(res)
			className = @$el.children(":first").attr("class")
			@$el.children(":first").children(":first").unwrap()
			@$el.attr("class", className)
		dust.render @template.name, options, template.bind(@)


class ServerNode extends Backbone.Model
	defaults:
		name: "name"
		ip: "ip"
		status: "ready"

class ServerNodeCollection extends Backbone.Collection
	model: ServerNode

class ServersWidget extends Widget
	defaults:
		nodes: new ServerNodeCollection()
	initialize: ->
		events.on "serverwidget:update", @update.bind @
	update: (data) ->
		@get('nodes').update(new ServerNode node for node in data.nodes)
		console.log "got update"
		console.log @get('nodes')
		render = 
			nodes: @get('nodes').toJSON()
		events.trigger "serverwidget:render", render

class ServersWidgetView extends WidgetView
	events:
		'click .info-button': 'info'
		'click .job-button': 'job'
	initialize: (model,template, el)->
		super model, template, el
		_.bindAll @, 'update', 'info', 'job', 'getModelFromEv'
		events.on "serverwidget:render", @update
	update: (data) ->
		@render data
	getModelFromEv: (ev) ->
		id = $(ev.currentTarget).parent().data('id')
		return @model.get('nodes').get(id)
	info: (ev) ->
		events.trigger "infowidget:showinfo", @getModelFromEv ev
	job: (ev) ->
		events.trigger "jobwidget:show", @getModelFromEv ev



class InfoWidget extends Widget
	defaults:
		node: new ServerNode()
	initialize: ->
		events.on "infowidget:showinfo", @update.bind @
	update: (data) ->
		@set('node',data)
		render = 
			node: data.toJSON()
		events.trigger 'infowidget:render', render

class InfoWidgetView extends WidgetView
	initialize: (model, template, el)->
		super model, template, el
		events.on "infowidget:render", @update.bind @
	update: (data) ->
		@render data

class JobWidget extends Widget
	defaults:
		node: new ServerNode()
	initialize: ->
		events.on "jobwidget:show", @update.bind @
	update: (data) ->
		@set('node', data)
		render =
			node: data.toJSON()
		events.trigger 'jobwidget:render', render

class JobWidgetView extends WidgetView
	initialize: (model, template, el)->
		super model, template, el
		events.on "jobwidget:render", @update.bind @
		console.log @$el
	update: (data) ->
		@render data
		new Behave
    		textarea: @$el.find("textarea")[0]
		

widgets =
	serverwidget : 
		model: ServersWidget
		view: ServersWidgetView
	infowidget :
		model: InfoWidget
		view: InfoWidgetView
	jobwidget :
		model: JobWidget
		view: JobWidgetView


@widgetList = []

addWidget = (name, callback) ->
	el = $('<div/>').appendTo('#mainBox')
	loadTemplate name , (data) ->
		widgetList.push new widgets[name].view new widgets[name].model,data,el
		callback() if callback

addWidget "serverwidget", ->
	@socket = io.connect()
	@socket.on "update", (data) -> 
		events.trigger data.target, data

addWidget "infowidget"
addWidget "jobwidget"