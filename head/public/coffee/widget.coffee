window.Sprinkler = {}

class Sprinkler.Widget extends Backbone.Model

class Sprinkler.WidgetView extends Backbone.View
    events:
        'click .close': 'reset'
    initialize:(model, template, el) ->
        @self = @
        @model = model
        @$el = el
        @template = template
        dust.loadSource dust.compile template.data, template.name
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


class Sprinkler.ServerNode extends Backbone.Model
    defaults:
        name: "name"
        hostname: "hostname"
        status: "ready"