class Sprinkler.InfoWidget extends Sprinkler.Widget
    defaults:
        node: new Sprinkler.ServerNode()
    initialize: ->
        events.on "infowidget:showinfo", @update.bind @
        events.on "infowidget:clientJobs", @clientJobs.bind @
        events.on "infowidget:clientCurrentJob", @clientCurrentJob.bind @
    update: (data) ->
        @set('node',data)
        render =
            node: data.toJSON()
        events.trigger 'infowidget:render', render
    clientJobs: (data) ->
        @get('node').set
            jobs: data
        render =
            node: data.toJSON()
        events.trigger 'infowidget:render', render
    clientCurrentJob: (data) ->
        return

class Sprinkler.InfoWidgetView extends Sprinkler.WidgetView
    initialize: (model, template, el)->
        super model, template, el
        events.on "infowidget:render", @update.bind @
    update: (data) ->
        @render data