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
	initialize: (model,template, el)->
		super model, template, el
		_.bindAll @, 'update', 'info'
		events.on "serverwidget:render", @update
	update: (data) ->
		@render data
	info: (ev) ->
		id = $(ev.currentTarget).parent().data('id')
		events.trigger "infowidget:showinfo", @model.get('nodes').get(id)

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

widgets =
	serverwidget : 
		model: ServersWidget
		view: ServersWidgetView
	infowidget :
		model: InfoWidget
		view: InfoWidgetView

@widgetList = []

addWidget = (name, callback) ->
	el = $('<div/>').appendTo('#mainBox')
	loadTemplate name , (data) ->
		widgetList.push new widgets[name].view new widgets[name].model,data,el
		callback()

addWidget "serverwidget", ->
	@socket = io.connect()
	@socket.on "update", (data) -> 
		events.trigger data.target, data

addWidget "infowidget", (data) ->
	

###
class SidePanelView extends Backbone.View
	initialize: -> 

class MainContentCollection extends Backbone.Collection
	model: Widget

class WidgetView extends Backbone.View
	initialize: ->
		@listenTo @model, 'change', this.render
		@listenTo @model, 'destroy', this.remove
		#@render()
	render: ->
		console.log "OMG RENDERING"
		#el.html()

class Widget extends Backbone.Model
	defaults:
		name: 'default'
		width: 300
		height: 400
	initialize: ->#(template) ->
		#self = @
		#dust.loadSource dust.compile template.data,template.name
		#dust.render template.name, {name:"Jimmy"}, (err, res) ->
		#	self.template = res
		#	console.log "rendered"

class ServerWidget extends Widget
	initialize: -># (template) ->
		#super template
		#events.on "#{template.name}:servers", @displayServers

	#displayServers: (data) ->
	#	console.log data
	#	dust.render @template, {data}, (err, res) ->
	#		console.log "rendered"

class ServerWidgetView extends WidgetView

class MainContentView extends Backbone.View
	initialize: ->
		@collection.on 'add', @addWidget, @

	addWidget: (widget) ->
		widget.render()
		#@$el.append widget.template
		
widgets =
	"serverwidget" : ServerWidget

addWidget = (name) ->
	loadTemplate name , (data) ->
		console.log data
		mainCollection.add new WidgetView new widgets[name] data

@sidePanel = new SidePanelView
@mainCollection = new MainContentCollection
@mainView = new MainContentView
	el : $ "#mainBox"
	collection : mainCollection

addWidget "serverwidget"
###
###
onclick = mainContentCollection.add(widgetEditorVIew(this.selection))
onclick = mainContentCollection.add(widgetInfoView(this.selection))###