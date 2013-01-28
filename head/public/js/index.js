(function() {
  var MainContentCollection, ServerWidget, SidePanelView, Widget, WidgetView, mainBox, sidePanel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SidePanelView = (function(_super) {

    __extends(SidePanelView, _super);

    function SidePanelView() {
      return SidePanelView.__super__.constructor.apply(this, arguments);
    }

    SidePanelView.prototype.initialize = function() {};

    return SidePanelView;

  })(Backbone.View);

  sidePanel = new SidePanelView;

  Widget = (function(_super) {

    __extends(Widget, _super);

    function Widget() {
      return Widget.__super__.constructor.apply(this, arguments);
    }

    Widget.prototype.defaults = {
      name: 'default',
      width: 300,
      height: 400
    };

    Widget.prototype.initialize = function() {};

    return Widget;

  })(Backbone.Model);

  MainContentCollection = (function(_super) {

    __extends(MainContentCollection, _super);

    function MainContentCollection() {
      return MainContentCollection.__super__.constructor.apply(this, arguments);
    }

    MainContentCollection.prototype.model = Widget;

    return MainContentCollection;

  })(Backbone.Collection);

  WidgetView = (function(_super) {

    __extends(WidgetView, _super);

    function WidgetView() {
      return WidgetView.__super__.constructor.apply(this, arguments);
    }

    WidgetView.prototype.initialize = function(model) {
      return this.model = model;
    };

    return WidgetView;

  })(Backbone.View);

  ServerWidget = (function(_super) {

    __extends(ServerWidget, _super);

    function ServerWidget() {
      return ServerWidget.__super__.constructor.apply(this, arguments);
    }

    return ServerWidget;

  })(Widget);

  mainBox = new MainContentCollection;

  this.serverWidget = new ServerWidget;

  mainBox.add(serverWidget);

  /*
  onclick = mainContentCollection.add(widgetEditorVIew(this.selection))
  onclick = mainContentCollection.add(widgetInfoView(this.selection))
  */


}).call(this);
