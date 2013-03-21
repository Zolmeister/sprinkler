(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Sprinkler.InfoWidget = (function(_super) {

    __extends(InfoWidget, _super);

    function InfoWidget() {
      return InfoWidget.__super__.constructor.apply(this, arguments);
    }

    InfoWidget.prototype.defaults = {
      node: new Sprinkler.ServerNode()
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

  })(Sprinkler.Widget);

  Sprinkler.InfoWidgetView = (function(_super) {

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

  })(Sprinkler.WidgetView);

}).call(this);
