(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Sprinkler.JobWidget = (function(_super) {

    __extends(JobWidget, _super);

    function JobWidget() {
      return JobWidget.__super__.constructor.apply(this, arguments);
    }

    JobWidget.prototype.defaults = {
      node: new Sprinkler.ServerNode(),
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

  })(Sprinkler.Widget);

  Sprinkler.JobWidgetView = (function(_super) {

    __extends(JobWidgetView, _super);

    function JobWidgetView() {
      return JobWidgetView.__super__.constructor.apply(this, arguments);
    }

    JobWidgetView.prototype.events = {
      'click .create': 'create',
      'click .cancel': 'reset',
      'click .close': 'reset',
      'keyup .job-name': 'name'
    };

    JobWidgetView.prototype.initialize = function(model, template, el) {
      JobWidgetView.__super__.initialize.call(this, model, template, el);
      _.bindAll(this, 'update', 'handleMainFile', 'handleExtraFiles', 'handleExtraFilesOver', 'removeFile', 'renderUploads', 'create');
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

    JobWidgetView.prototype.create = function() {
      var command, id, name;
      name = this.model.get('name');
      id = this.model.get('node').id;
      command = this.$el.find('#main-upload').val();
      events.trigger('createJob', name, id, command);
      return this.reset();
    };

    JobWidgetView.prototype.name = function(ev) {
      var name;
      name = $(ev.currentTarget).val();
      return this.model.set('name', name);
    };

    return JobWidgetView;

  })(Sprinkler.WidgetView);

}).call(this);
