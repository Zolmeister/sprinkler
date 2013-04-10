class Sprinkler.ServerNodeCollection extends Backbone.Collection
    model: Sprinkler.ServerNode
    
class Sprinkler.ServersWidget extends Sprinkler.Widget
    defaults:
        nodes: new Sprinkler.ServerNodeCollection()
    initialize: ->
        events.on "serverwidget:updateList", @updateList.bind @
        events.on "serverwidget:updateClient", @updateClient.bind @
    updateList: (data) ->
        @get('nodes').update(new Sprinkler.ServerNode node for node in data)
        console.log @get('nodes')
        render =
            nodes: @get('nodes').toJSON()
        events.trigger "serverwidget:render", render
    updateClient: (data) ->
        if @get('nodes').get(data.id)
            @get('nodes').get(data.id).update(new Sprinkler.ServerNode data)
        else
            @get('nodes').add(new Sprinkler.ServerNode data)
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
        _.bindAll @,'info', 'job', 'getModelFromEv', 'addClient'
        events.on "serverwidget:render", @render.bind(@)
    getModelFromEv: (ev) ->
        id = $(ev.currentTarget).parent().data('id')
        return @model.get('nodes').get(id)
    addClient: ->
        events.trigger "clientwidget:show"
    info: (ev) ->
        events.trigger "infowidget:showinfo", @getModelFromEv ev
    job: (ev) ->
        events.trigger "jobwidget:show", @getModelFromEv ev