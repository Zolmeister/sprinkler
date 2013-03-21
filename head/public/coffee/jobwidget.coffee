class Sprinkler.JobWidget extends Sprinkler.Widget
	defaults:
		node: new Sprinkler.ServerNode(),
		files: [],
		name: ''
	initialize: ->
		events.on "jobwidget:show", @update.bind @
	update: (data) ->
		@set('node', data)
		render =
			node: data.toJSON()
		events.trigger 'jobwidget:render', render

class Sprinkler.JobWidgetView extends Sprinkler.WidgetView
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