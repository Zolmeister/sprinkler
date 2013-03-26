(function() {
  var addWidget, createClient, socketUpdate, widgets;

  this.loadTemplate = function(name, callback) {
    return $.get("/views/" + name + ".dust", function(data) {
      return callback({
        data: data,
        name: name
      });
    });
  };

  this.events = _.clone(Backbone.Events);

  widgets = {
    serverwidget: {
      model: Sprinkler.ServersWidget,
      view: Sprinkler.ServersWidgetView
    },
    infowidget: {
      model: Sprinkler.InfoWidget,
      view: Sprinkler.InfoWidgetView
    },
    jobwidget: {
      model: Sprinkler.JobWidget,
      view: Sprinkler.JobWidgetView
    },
    clientwidget: {
      model: Sprinkler.ClientWidget,
      view: Sprinkler.ClientWidgetView
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

  socketUpdate = function(data) {
    console.log(data);
    if (data.clientList) {
      return events.trigger('serverwidget:update', data.clientList);
    }
  };

  this.socket = io.connect();

  this.socket.on("update", socketUpdate);

  addWidget("serverwidget", function() {
    return this.socket.emit('getClientList');
  });

  addWidget("infowidget");

  addWidget("jobwidget");

  addWidget("clientwidget");

  createClient = function(name, hostname, def, ssh_user, ssh_pw, root_pw) {
    return this.socket.emit('createClient', {
      "name": name,
      "hostname": hostname,
      "default": def,
      "ssh_user": ssh_user,
      "ssh_pw": ssh_pw,
      "root_pw": root_pw
    });
  };

  events.on("createClient", createClient.bind(this));

}).call(this);
