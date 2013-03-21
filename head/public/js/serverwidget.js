(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Sprinkler.ServerNodeCollection = (function(_super) {

    __extends(ServerNodeCollection, _super);

    function ServerNodeCollection() {
      return ServerNodeCollection.__super__.constructor.apply(this, arguments);
    }

    ServerNodeCollection.prototype.model = Sprinkler.ServerNode;

    return ServerNodeCollection;

  })(Backbone.Collection);

  Sprinkler.ServersWidget = (function(_super) {

    __extends(ServersWidget, _super);

    function ServersWidget() {
      return ServersWidget.__super__.constructor.apply(this, arguments);
    }

    ServersWidget.prototype.defaults = {
      nodes: new Sprinkler.ServerNodeCollection()
    };

    ServersWidget.prototype.initialize = function() {
      return events.on("serverwidget:update", this.update.bind(this));
    };

    ServersWidget.prototype.update = function(data) {
      var node, render;
      this.get('nodes').update((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = data.length; _i < _len; _i++) {
          node = data[_i];
          _results.push(new Sprinkler.ServerNode(node));
        }
        return _results;
      })());
      console.log("got update");
      console.log(this.get('nodes'));
      render = {
        nodes: this.get('nodes').toJSON()
      };
      return events.trigger("serverwidget:render", render);
    };

    return ServersWidget;

  })(Sprinkler.Widget);

  Sprinkler.ServersWidgetView = (function(_super) {

    __extends(ServersWidgetView, _super);

    function ServersWidgetView() {
      return ServersWidgetView.__super__.constructor.apply(this, arguments);
    }

    ServersWidgetView.prototype.events = {
      'click .info-button': 'info',
      'click .job-button': 'job',
      'click .add-client': 'addClient'
    };

    ServersWidgetView.prototype.initialize = function(model, template, el) {
      ServersWidgetView.__super__.initialize.call(this, model, template, el);
      _.bindAll(this, 'update', 'info', 'job', 'getModelFromEv', 'addClient');
      return events.on("serverwidget:render", this.update);
    };

    ServersWidgetView.prototype.update = function(data) {
      return this.render(data);
    };

    ServersWidgetView.prototype.getModelFromEv = function(ev) {
      var id;
      id = $(ev.currentTarget).parent().data('id');
      return this.model.get('nodes').get(id);
    };

    ServersWidgetView.prototype.addClient = function() {
      return events.trigger("clientwidget:show");
    };

    ServersWidgetView.prototype.info = function(ev) {
      return events.trigger("infowidget:showinfo", this.getModelFromEv(ev));
    };

    ServersWidgetView.prototype.job = function(ev) {
      return events.trigger("jobwidget:show", this.getModelFromEv(ev));
    };

    return ServersWidgetView;

  })(Sprinkler.WidgetView);

}).call(this);
