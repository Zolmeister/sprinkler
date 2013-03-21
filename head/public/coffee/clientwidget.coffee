class Sprinkler.ClientWidget extends Sprinkler.Widget
    initialize: ->
        events.on "clientwidget:show", @update.bind @
    update: ->
        events.trigger 'clientwidget:render'
    
class Sprinkler.ClientWidgetView extends Sprinkler.WidgetView
    initialize: (model, template, el)->
        super model, template, el
        events.on "clientwidget:render", @update.bind @
    update: ->
        @render()