class Sprinkler.ClientWidget extends Sprinkler.Widget
    initialize: ->
        events.on "clientwidget:show", @update.bind @
    update: ->
        events.trigger 'clientwidget:render'
    
class Sprinkler.ClientWidgetView extends Sprinkler.WidgetView
    events:
        'click .create' : 'create'
        'click .cancel' : 'reset'
        'click .close': 'reset'
        'keypress input': 'filterOnEnter'
    initialize: (model, template, el)->
        super model, template, el
        _.bindAll @, 'filterOnEnter', 'create'
        events.on "clientwidget:render", @update.bind @
    update: ->
        @render()
    filterOnEnter: (ev)->
        if ev.keyCode != 13
            return
        @create(ev)
    create: (ev)->
        ev.preventDefault()
        inputs = $(ev.currentTarget).parent().serializeArray()
        obj = {}
        for input in inputs
            obj[input.name]=input.value
        events.trigger 'createClient', obj
        @reset()
        