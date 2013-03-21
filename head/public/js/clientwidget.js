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

    ClientWidgetView.prototype.initialize = function(model, template, el) {
      ClientWidgetView.__super__.initialize.call(this, model, template, el);
      return events.on("clientwidget:render", this.update.bind(this));
    };

    ClientWidgetView.prototype.update = function() {
      return this.render();
    };

    return ClientWidgetView;

  })(Sprinkler.WidgetView);

}).call(this);
