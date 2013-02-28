(function() {
  var InfoWidget, InfoWidgetView, JobWidget, JobWidgetView, ServerNode, ServerNodeCollection, ServersWidget, ServersWidgetView, Widget, WidgetView, addWidget, widgets,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.loadTemplate = function(name, callback) {
    return $.get("/views/" + name + ".dust", function(data) {
      return callback({
        data: data,
        name: name
      });
    });
  };

  this.events = _.clone(Backbone.Events);

  Widget = (function(_super) {

    __extends(Widget, _super);

    function Widget() {
      return Widget.__super__.constructor.apply(this, arguments);
    }

    return Widget;

  })(Backbone.Model);

  WidgetView = (function(_super) {

    __extends(WidgetView, _super);

    function WidgetView() {
      return WidgetView.__super__.constructor.apply(this, arguments);
    }

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

    return WidgetView;

  })(Backbone.View);

  ServerNode = (function(_super) {

    __extends(ServerNode, _super);

    function ServerNode() {
      return ServerNode.__super__.constructor.apply(this, arguments);
    }

    ServerNode.prototype.defaults = {
      name: "name",
      ip: "ip",
      status: "ready"
    };

    return ServerNode;

  })(Backbone.Model);

  ServerNodeCollection = (function(_super) {

    __extends(ServerNodeCollection, _super);

    function ServerNodeCollection() {
      return ServerNodeCollection.__super__.constructor.apply(this, arguments);
    }

    ServerNodeCollection.prototype.model = ServerNode;

    return ServerNodeCollection;

  })(Backbone.Collection);

  ServersWidget = (function(_super) {

    __extends(ServersWidget, _super);

    function ServersWidget() {
      return ServersWidget.__super__.constructor.apply(this, arguments);
    }

    ServersWidget.prototype.defaults = {
      nodes: new ServerNodeCollection()
    };

    ServersWidget.prototype.initialize = function() {
      return events.on("serverwidget:update", this.update.bind(this));
    };

    ServersWidget.prototype.update = function(data) {
      var node, render;
      this.get('nodes').update((function() {
        var _i, _len, _ref, _results;
        _ref = data.nodes;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          _results.push(new ServerNode(node));
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

  })(Widget);

  ServersWidgetView = (function(_super) {

    __extends(ServersWidgetView, _super);

    function ServersWidgetView() {
      return ServersWidgetView.__super__.constructor.apply(this, arguments);
    }

    ServersWidgetView.prototype.events = {
      'click .info-button': 'info',
      'click .job-button': 'job'
    };

    ServersWidgetView.prototype.initialize = function(model, template, el) {
      ServersWidgetView.__super__.initialize.call(this, model, template, el);
      _.bindAll(this, 'update', 'info', 'job', 'getModelFromEv');
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

    ServersWidgetView.prototype.info = function(ev) {
      return events.trigger("infowidget:showinfo", this.getModelFromEv(ev));
    };

    ServersWidgetView.prototype.job = function(ev) {
      return events.trigger("jobwidget:show", this.getModelFromEv(ev));
    };

    return ServersWidgetView;

  })(WidgetView);

  InfoWidget = (function(_super) {

    __extends(InfoWidget, _super);

    function InfoWidget() {
      return InfoWidget.__super__.constructor.apply(this, arguments);
    }

    InfoWidget.prototype.defaults = {
      node: new ServerNode()
    };

    InfoWidget.prototype.initialize = function() {
      return events.on("infowidget:showinfo", this.update.bind(this));
    };

    InfoWidget.prototype.update = function(data) {
      var render;
      this.set('node', data);
      render = {
        node: data.toJSON()
      };
      return events.trigger('infowidget:render', render);
    };

    return InfoWidget;

  })(Widget);

  InfoWidgetView = (function(_super) {

    __extends(InfoWidgetView, _super);

    function InfoWidgetView() {
      return InfoWidgetView.__super__.constructor.apply(this, arguments);
    }

    InfoWidgetView.prototype.initialize = function(model, template, el) {
      InfoWidgetView.__super__.initialize.call(this, model, template, el);
      return events.on("infowidget:render", this.update.bind(this));
    };

    InfoWidgetView.prototype.update = function(data) {
      return this.render(data);
    };

    return InfoWidgetView;

  })(WidgetView);

  JobWidget = (function(_super) {

    __extends(JobWidget, _super);

    function JobWidget() {
      return JobWidget.__super__.constructor.apply(this, arguments);
    }

    JobWidget.prototype.defaults = {
      node: new ServerNode()
    };

    JobWidget.prototype.initialize = function() {
      return events.on("jobwidget:show", this.update.bind(this));
    };

    JobWidget.prototype.update = function(data) {
      var render;
      this.set('node', data);
      render = {
        node: data.toJSON()
      };
      return events.trigger('jobwidget:render', render);
    };

    return JobWidget;

  })(Widget);

  JobWidgetView = (function(_super) {

    __extends(JobWidgetView, _super);

    function JobWidgetView() {
      return JobWidgetView.__super__.constructor.apply(this, arguments);
    }

    JobWidgetView.prototype.initialize = function(model, template, el) {
      JobWidgetView.__super__.initialize.call(this, model, template, el);
      events.on("jobwidget:render", this.update.bind(this));
      return console.log(this.$el);
    };

    JobWidgetView.prototype.update = function(data) {
      this.render(data);
      return new Behave({
        textarea: this.$el.find("textarea")[0]
      });
    };

    return JobWidgetView;

  })(WidgetView);

  widgets = {
    serverwidget: {
      model: ServersWidget,
      view: ServersWidgetView
    },
    infowidget: {
      model: InfoWidget,
      view: InfoWidgetView
    },
    jobwidget: {
      model: JobWidget,
      view: JobWidgetView
    }
  };

  this.widgetList = [];

  addWidget = function(name, callback) {
    var el;
    el = $('<div/>').appendTo('#mainBox');
    return loadTemplate(name, function(data) {
      widgetList.push(new widgets[name].view(new widgets[name].model, data, el));
      if (callback) {
        return callback();
      }
    });
  };

  addWidget("serverwidget", function() {
    this.socket = io.connect();
    return this.socket.on("update", function(data) {
      return events.trigger(data.target, data);
    });
  });

  addWidget("infowidget");

  addWidget("jobwidget");

}).call(this);
