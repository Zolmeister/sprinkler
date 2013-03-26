(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Sprinkler.ClientWidget = (function(_super) {

    __extends(ClientWidget, _super);

    function ClientWidget() {
      return ClientWidget.__super__.constructor.apply(this, arguments);
    }

    ClientWidget.prototype.initialize = function() {
      return events.on("clientwidget:show", this.update.bind(this));
    };

    ClientWidget.prototype.update = function() {
      return events.trigger('clientwidget:render');
    };

    return ClientWidget;

  })(Sprinkler.Widget);

  Sprinkler.ClientWidgetView = (function(_super) {

    __extends(ClientWidgetView, _super);

    function ClientWidgetView() {
      return ClientWidgetView.__super__.constructor.apply(this, arguments);
    }

    ClientWidgetView.prototype.events = {
      'click .create': 'create',
      'click .cancel': 'reset',
      'click .close': 'reset',
      'keypress input': 'filterOnEnter'
    };

    ClientWidgetView.prototype.initialize = function(model, template, el) {
      ClientWidgetView.__super__.initialize.call(this, model, template, el);
      _.bindAll(this, 'filterOnEnter', 'create');
      return events.on("clientwidget:render", this.update.bind(this));
    };

    ClientWidgetView.prototype.update = function() {
      return this.render();
    };

    ClientWidgetView.prototype.filterOnEnter = function(ev) {
      if (ev.keyCode !== 13) {
        return;
      }
      return this.create(ev);
    };

    ClientWidgetView.prototype.create = function(ev) {
      var input, inputs, obj, _i, _len;
      ev.preventDefault();
      inputs = $(ev.currentTarget).parent().serializeArray();
      obj = {};
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        input = inputs[_i];
        obj[input.name] = input.value;
      }
      events.trigger('createClient', obj['client-name'], obj['client-hostname'], obj.def, obj.ssh_user, obj.ssh_pw, obj.root_pw);
      return this.reset();
    };

    return ClientWidgetView;

  })(Sprinkler.WidgetView);

}).call(this);
