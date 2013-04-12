(function() {
  var addWidget, commandObj, createClient, createJob, getClientCurrentJob, getClientJobs, getClientList, getPublicKey, removeClient, removeJob, sendSocket, socketUpdate, widgets;

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
    if (!typeof data.success === 'undefined') {
      console.error(data.error);
    }
    if (data.updateClient) {
      events.trigger('serverwidget:updateClient', data.updateClient);
    }
    if (data.clientList) {
      events.trigger('serverwidget:updateList', data.clientList);
    }
    if (data.clientJobs) {
      events.trigget('infowidget:clientJobs', data.clientJobs);
    }
    if (data.clientCurrentJob) {
      events.trigger('infowidget:clientCurrentJob', data.clientCurrentJob);
    }
    if (data.publicKey) {
      return events.trigger('clientwidget:publicKey', data.publicKey);
    }
  };

  this.socket = io.connect();

  this.socket.on("update", socketUpdate);

  addWidget("serverwidget", function() {
    return getClientList();
  });

  addWidget("infowidget");

  addWidget("jobwidget");

  addWidget("clientwidget");

  sendSocket = function(label, obj) {
    var socketObj;
    socketObj = {};
    socketObj[label] = obj;
    return this.socket.emit('message', socketObj);
  };

  createClient = function(name, hostname, sshUser, publicKey, sshPassword, rootPassword) {
    var clientObj;
    clientObj = {
      name: name,
      hostname: hostname,
      sshUser: sshUser
    };
    if (publicKey) {
      clientObj.publicKey = true;
    }
    if (sshPassword) {
      clientObj.sshPassword = sshPassword;
    }
    if (rootPassword) {
      clientObj.rootPassword = rootPassword;
    }
    return sendSocket('newClient', clientObj);
  };

  createJob = function(name, clientId, command) {
    return sendSocket('newJob', {
      name: name,
      clientId: clientId,
      command: {
        sh: command
      }
    });
  };

  commandObj = function(dir, user, sh) {
    return {
      dir: dir,
      user: user,
      sh: sh
    };
  };

  removeJob = function(jobId) {
    return sendSocket('removeJob', {
      id: jobId
    });
  };

  removeClient = function(clientId) {
    return sendSocket('removeClient', clientId);
  };

  getClientList = function() {
    return sendSocket('getClientList', {});
  };

  getClientJobs = function(clientId) {
    return sendSocket('getClientJobs', {
      id: clientId
    });
  };

  getClientCurrentJob = function(clientId) {
    return sendSocket('getClientCurrentJob', {
      id: clientId
    });
  };

  getPublicKey = function() {
    return sendSocket('getPublicKey', {});
  };

  events.on("createClient", createClient.bind(this));

  events.on("createJob", createJob.bind(this));

  events.on("commandObj", commandObj.bind(this));

  events.on("removeJob", removeJob.bind(this));

  events.on("removeClient", removeClient.bind(this));

  events.on("getClientJobs", getClientJobs.bind(this));

  events.on("getClientCurrentJob", getClientCurrentJob.bind(this));

  events.on("getPublicKey", getPublicKey.bind(this));

}).call(this);
