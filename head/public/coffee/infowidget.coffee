class Sprinkler.InfoWidget extends Sprinkler.Widget
	defaults:
		node: new Sprinkler.ServerNode()
	initialize: ->
		events.on "infowidget:showinfo", @update.bind @
	update: (data) ->
		@set('node',data)
		render = 
			node: data.toJSON()
		events.trigger 'infowidget:render', render

class Sprinkler.InfoWidgetView extends Sprinkler.WidgetView
	initialize: (model, template, el)->
		super model, template, el
		events.on "infowidget:render", @update.bind @
	update: (data) ->
		@render data