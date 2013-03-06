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
      node: new ServerNode(),
      files: [],
      name: ''
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

    JobWidgetView.prototype.events = {
      'click .create': 'create',
      'click .cancel': 'cancel',
      'click .close': 'reset',
      'keyup .job-name': 'name'
    };

    JobWidgetView.prototype.initialize = function(model, template, el) {
      JobWidgetView.__super__.initialize.call(this, model, template, el);
      _.bindAll(this, 'update', 'handleMainFile', 'handleExtraFiles', 'handleExtraFilesOver', 'removeFile', 'renderUploads', 'create', 'cancel');
      return events.on("jobwidget:render", this.update.bind(this));
    };

    JobWidgetView.prototype.update = function(data) {
      var extraDrop, mainDrop;
      this.render(data);
      mainDrop = this.$el.find("#main-upload")[0];
      new Behave({
        textarea: mainDrop
      });
      mainDrop.addEventListener('drop', this.handleMainFile, false);
      extraDrop = this.$el.find("#extra-upload")[0];
      extraDrop.addEventListener('drop', this.handleExtraFiles, false);
      return extraDrop.addEventListener('dragover', this.handleExtraFilesOver, false);
    };

    JobWidgetView.prototype.handleMainFile = function(ev) {
      var $el, file, reader;
      $el = this.$el;
      ev.stopPropagation();
      ev.preventDefault();
      file = ev.dataTransfer.files[0];
      reader = new FileReader();
      reader.onload = function(e) {
        var text;
        text = e.target.result;
        return $el.find("#main-upload").html(text);
      };
      return reader.readAsText(file);
    };

    JobWidgetView.prototype.handleExtraFiles = function(ev) {
      var fileList, files, i, _i, _ref;
      ev.stopPropagation();
      ev.preventDefault();
      files = ev.dataTransfer.files;
      fileList = [];
      for (i = _i = 0, _ref = files.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        fileList.push(files[i]);
      }
      this.model.set('files', this.model.get('files').concat(fileList));
      return this.renderUploads();
    };

    JobWidgetView.prototype.removeFile = function(ev) {
      var files, id;
      id = $(ev.currentTarget).data('id');
      files = this.model.get('files');
      files.splice(id, 1);
      this.model.set('files', files);
      return this.renderUploads();
    };

    JobWidgetView.prototype.handleExtraFilesOver = function(ev) {
      return ev.preventDefault();
    };

    JobWidgetView.prototype.renderUploads = function() {
      var $upload, names;
      $upload = this.$el.find("#extra-upload");
      $upload.css({
        'line-height': 'normal'
      });
      names = function(file, i) {
        return ("<span class='file' data-id=" + i + "><span class='close-x'>x</span>") + file.name + "</span>";
      };
      $upload.html(this.model.get('files').map(names).join("<br>"));
      $upload.unbind();
      return $upload.on('click', '.file', this.removeFile);
    };

    JobWidgetView.prototype.cancel = function() {
      return this.reset();
    };

    JobWidgetView.prototype.create = function() {
      return console.log(this.model);
    };

    JobWidgetView.prototype.name = function(ev) {
      var name;
      name = $(ev.currentTarget).val();
      return this.model.set('name', name);
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
