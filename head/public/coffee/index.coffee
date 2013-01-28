class SidePanelView extends Backbone.View
	initialize: -> 
		
sidePanel = new SidePanelView

class Widget extends Backbone.Model
	defaults:
		name: 'default'
		width: 300
		height: 400
	initialize: ->


class MainContentCollection extends Backbone.Collection
	model: Widget

class WidgetView extends Backbone.View
	initialize: (model) ->
		@model = model

class ServerWidget extends Widget
	
mainBox = new MainContentCollection
@serverWidget = new ServerWidget
mainBox.add serverWidget


###
onclick = mainContentCollection.add(widgetEditorVIew(this.selection))
onclick = mainContentCollection.add(widgetInfoView(this.selection))###