// extend the class
Photosphere.prototype.Main = function(config, context) {

  // PROPERTIES

  this.context = context;
  this.element = config.element;
  this.config = {
    'idle': 0.002,
    'container': document.body,
    'slicer': '{src}'
  };

  for (key in config) {
    this.config[key] = config[key];
  }

  // METHODS

  this.viewer = function() {
    // create the components
    this.stage = new this.context.Stage(this);
    this.controls = new this.context.Controls(this);
    this.loader = new this.context.Loader(this);
    // create the url for the image sizing webservice
    var size = 'height=1080';
    var src = this.element.getAttribute('href') || this.element.getAttribute('data-src') || this.element.getAttribute('src');
    var url = this.config.slicer.replace('{src}', src).replace('{size}', size);
    // load the viewer
    this.loader.load(url, {
      'complete': this.onViewerComplete.bind(this),
      'update': this.onViewerLoading.bind(this),
      'error': this.onViewerError.bind(this)
    });
  };

  this.onElementClicked = function(evt) {
    // prevent the click
    evt.preventDefault();
    // show the busy indicator
    this.busy = new this.context.Busy(this.config.container);
    this.busy.show();
    // load the viewer
    this.viewer();
    // resolve the opened promise
    if (this.config.opened) { this.config.opened(this.config.element); }
  };

  this.onViewerComplete = function(photo) {
    // hide busy indicator
    this.busy.hide();
    // show the popup
    this.popup = new this.context.Popup(this);
    this.popup.show();
    // create the stage
    this.stage.create(photo);
    // implement the controls
    this.controls.implement();
  };

  this.onViewerLoading = function(progress) {
    // TODO: make busy component show update %
  };

  this.onViewerError = function(message) {
    // hide busy indicator
    this.busy.hide();
    // jump directly to the the locator promise if available
    if (this.config.located) { this.config.located(this.config.element); }
  };

  // EVENTS

  this.element.addEventListener('click', this.onElementClicked.bind(this));

};
