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
      events.on("serverwidget:updateList", this.updateList.bind(this));
      return events.on("serverwidget:updateClient", this.updateClient.bind(this));
    };

    ServersWidget.prototype.updateList = function(data) {
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
      console.log(this.get('nodes'));
      render = {
        nodes: this.get('nodes').toJSON()
      };
      return events.trigger("serverwidget:render", render);
    };

    ServersWidget.prototype.updateClient = function(data) {
      var render;
      if (this.get('nodes').get(data.id)) {
        this.get('nodes').get(data.id).update(new Sprinkler.ServerNode(data));
      } else {
        this.get('nodes').add(new Sprinkler.ServerNode(data));
      }
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
      _.bindAll(this, 'info', 'job', 'getModelFromEv', 'addClient');
      return events.on("serverwidget:render", this.render.bind(this));
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
