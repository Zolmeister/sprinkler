(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Sprinkler = {};

  Sprinkler.Widget = (function(_super) {

    __extends(Widget, _super);

    function Widget() {
      return Widget.__super__.constructor.apply(this, arguments);
    }

    return Widget;

  })(Backbone.Model);

  Sprinkler.WidgetView = (function(_super) {

    __extends(WidgetView, _super);

    function WidgetView() {
      return WidgetView.__super__.constructor.apply(this, arguments);
    }

    WidgetView.prototype.events = {
      'click .close': 'reset'
    };

    WidgetView.prototype.initialize = function(model, template, el) {
      this.self = this;
      this.model = model;
      this.$el = el;
      this.template = template;
      return dust.loadSource(dust.compile(template.data, template.name));
    };

    WidgetView.prototype.render = function(options, callback) {
      var template;
      template = function(err, res) {
        var className;
        this.$el.html(res);
        className = this.$el.children(":first").attr("class");
        this.$el.children(":first").children(":first").unwrap();
        return this.$el.attr("class", className);
      };
      return dust.render(this.template.name, options, template.bind(this));
    };

    WidgetView.prototype.reset = function() {
      this.$el.html('');
      return this.$el.removeAttr('class', '');
    };

    return WidgetView;

  })(Backbone.View);

  Sprinkler.ServerNode = (function(_super) {

    __extends(ServerNode, _super);

    function ServerNode() {
      return ServerNode.__super__.constructor.apply(this, arguments);
    }

    ServerNode.prototype.defaults = {
      name: "name",
      hostname: "hostname",
      status: "ready"
    };

    return ServerNode;

  })(Backbone.Model);

}).call(this);
