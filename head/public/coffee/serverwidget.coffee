class Sprinkler.ServerNodeCollection extends Backbone.Collection
    model: Sprinkler.ServerNode
    
class Sprinkler.ServersWidget extends Sprinkler.Widget
    defaults:
        nodes: new Sprinkler.ServerNodeCollection()
    initialize: ->
        events.on "serverwidget:update", @update.bind @
    update: (data) ->
        @get('nodes').update(new Sprinkler.ServerNode node for node in data)
        console.log "got update"
        console.log @get('nodes')
        render =
            nodes: @get('nodes').toJSON()
        events.trigger "serverwidget:render", render

class Sprinkler.ServersWidgetView extends Sprinkler.WidgetView
    events:
        'click .info-button': 'info'
        'click .job-button': 'job'
        'click .add-client': 'addClient'
    initialize: (model,template, el)->
        super model, template, el
        _.bindAll @, 'update', 'info', 'job', 'getModelFromEv', 'addClient'
        events.on "serverwidget:render", @update
    update: (data) ->
        @render data
    getModelFromEv: (ev) ->
        id = $(ev.currentTarget).parent().data('id')
        return @model.get('nodes').get(id)
    addClient: ->
        events.trigger "clientwidget:show"
    info: (ev) ->
        events.trigger "infowidget:showinfo", @getModelFromEv ev
    job: (ev) ->
        events.trigger "jobwidget:show", @getModelFromEv ev