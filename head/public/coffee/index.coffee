@loadTemplate =  (name, callback) ->
	$.get "/views/#{name}.dust", (data) ->
		callback 
			data : data
			name : name

@events = _.clone Backbone.Events

class Widget extends Backbone.Model

class WidgetView extends Backbone.View
	events:
		'click .close': 'reset'
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
	reset: ->
		@$el.html('')
		@$el.removeAttr('class', '')


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
		node: new ServerNode(),
		files: [],
		name: ''
	initialize: ->
		events.on "jobwidget:show", @update.bind @
	update: (data) ->
		@set('node', data)
		render =
			node: data.toJSON()
		events.trigger 'jobwidget:render', render

class JobWidgetView extends WidgetView
	events:
		'click .create' : 'create'
		'click .cancel' : 'cancel'
		'click .close': 'reset'
		'keyup .job-name': 'name'
	initialize: (model, template, el)->
		super model, template, el
		_.bindAll @, 'update', 'handleMainFile', 'handleExtraFiles',
			'handleExtraFilesOver', 'removeFile', 'renderUploads', 
			'create', 'cancel'
		events.on "jobwidget:render", @update.bind @
	update: (data) ->
		@render data
		mainDrop = @$el.find("#main-upload")[0]
		new Behave
    		textarea: mainDrop
		mainDrop.addEventListener 'drop', @handleMainFile, false
		extraDrop = @$el.find("#extra-upload")[0]
		#maybe its the parent div?
		extraDrop.addEventListener 'drop', @handleExtraFiles, false
		extraDrop.addEventListener 'dragover', @handleExtraFilesOver, false
	handleMainFile: (ev) ->
		$el = @$el
		ev.stopPropagation()
		ev.preventDefault()
		file = ev.dataTransfer.files[0]
		reader = new FileReader()
		reader.onload = (e) ->
			text = e.target.result
			$el.find("#main-upload").html(text)
		reader.readAsText(file)
	handleExtraFiles: (ev) ->
		ev.stopPropagation()
		ev.preventDefault()
		files = ev.dataTransfer.files
		fileList = []
		for i in [0...files.length]
			fileList.push files[i]
		@model.set 'files', @model.get('files').concat(fileList)
		@renderUploads()
	removeFile: (ev) ->
		id = $(ev.currentTarget).data('id')
		files = @model.get('files')
		files.splice(id,1)
		@model.set 'files', files
		@renderUploads()
	handleExtraFilesOver: (ev) ->
		ev.preventDefault()
	renderUploads: ->
		$upload = @$el.find("#extra-upload")
		$upload.css(
			'line-height': 'normal'
			)
		names = (file, i) ->
			return "<span class='file' data-id=#{i}><span class='close-x'>x</span>"+file.name+"</span>"
		$upload.html @model.get('files').map(names).join("<br>")
		$upload.unbind()
		$upload.on 'click', '.file', @removeFile
	cancel: ->
		@reset()
	create: ->
		console.log @model
	name: (ev) ->
		name = $(ev.currentTarget).val()
		@model.set 'name', name

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