/*
	Source:
	van Creij, Maurice (2018). "photosphere.js: Overlays a full screen preview of a thumbnail", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Photosphere = function (config) {

		this.only = function (config) {
			// start an instance of the script
			return new this.Main(config, this).init();
		};

		this.each = function (config) {
			var _config, _context = this, instances = [];
			// for all element
			for (var a = 0, b = config.elements.length; a < b; a += 1) {
				// clone the configuration
				_config = Object.create(config);
				// insert the current element
				_config.element = config.elements[a];
				// start a new instance of the object
				instances[a] = new this.Main(_config, _context);
			}
			// return the instances
			return instances;
		};

		return (config.elements) ? this.each(config) : this.only(config);

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Photosphere });
if (typeof module != 'undefined') module.exports = Photosphere;

// extend the class
Photosphere.prototype.Busy = function (container) {

	// PROPERTIES

	"use strict";
	this.container = container;

	// METHODS

	this.init = function () {
		// not needed yet
	};

	this.show = function () {
		// construct the spinner
		this.spinner = document.createElement('div');
		this.spinner.className = (this.container === document.body) ?
			'photosphere-busy photosphere-busy-fixed photosphere-busy-active':
			'photosphere-busy photosphere-busy-active';
		this.container.appendChild(this.spinner);
	};

	this.hide = function () {
		// deconstruct the spinner
		if (this.spinner) {
			this.container.removeChild(this.spinner);
			this.spinner = null;
		}
	};

};

// extend the class
Photosphere.prototype.Controls = function(parent) {

  // PROPERTIES

  this.parent = parent;
  this.config = parent.config;
  this.pan = null;
  this.zoom = null;

  // METHODS

  this.implement = function() {
    // mouse
    this.config.figure.addEventListener('mousewheel', this.onWheel.bind(this), false);
    this.config.figure.addEventListener('DOMMouseScroll', this.onWheel.bind(this), false);
    this.config.figure.addEventListener('mousedown', this.onDrag.bind(this, 'start'));
    this.config.figure.addEventListener('mousemove', this.onDrag.bind(this, 'move'));
    this.config.figure.addEventListener('mouseup', this.onDrag.bind(this, 'end'));
    //document.body.addEventListener('mouseup', this.onDrag.bind(this, 'end'));
    // touch
    this.config.figure.addEventListener('touchstart', this.onTouch.bind(this, 'start'));
    this.config.figure.addEventListener('touchmove', this.onTouch.bind(this, 'move'));
    this.config.figure.addEventListener('touchend', this.onTouch.bind(this, 'end'));
    //document.body.addEventListener('touchend', this.onTouch.bind(this, 'end'));
  };

  this.activate = function() {
    if (this.config.idle !== 0 && this.config.figure) {
      // flag the component active
      this.config.figure.className += ' active';
      // remove the idle animation
      this.config.idle = 0;
    }
  };

  this.deactivate = function() {
    if (this.config.idle === 0 && this.config.figure) {
      // flag the component passive
      this.config.figure.className = this.config.figure.className.replace(/ active/g, '');
      // restore the idle animation
      this.config.idle = 0.002;
    }
  };

  // EVENTS

  this.onIdle = function() {
    clearTimeout(this.config.idleTimeout);
    this.config.idleTimeout = setTimeout(this.deactivate.bind(this), 500);
  };

  this.onTouch = function(phase, event) {
    // cancel the interaction
    event.preventDefault();
    this.activate();
    // if there's more than one touch
    if (event.touches.length > 1) {
      // treat this as a pinch
      this.onPinch(phase, event);
      // else
    } else {
      // treat this as a drag
      this.onDrag(phase, event);
    }
  };

  this.onDrag = function(phase, event) {
    var x, y, dx, dy,
      camera = this.config.camera,
      w = this.config.figure.offsetWidth,
      h = this.config.figure.offsetHeight,
      fov = camera.fov / 360 * 2 * Math.PI;
    // cancel the drag
    event.preventDefault();
    this.activate();
    // for every phase of the drag
    switch (phase) {
      case 'start':
        // store the start position
        this.pan = {
          'x': event.clientX || event.touches[0].pageX,
          'y': event.clientY || event.touches[0].pageY
        };
        break;
      case 'move':
        // reset the idle timer
        this.onIdle();
        // if mouse is down
        if (this.pan !== null) {
          // update the position
          x = event.clientX || event.touches[0].pageX;
          y = event.clientY || event.touches[0].pageY;
          dx = x - this.pan.x;
          dy = y - this.pan.y;
          // calculate the rotation
          camera.rotation.y += dx / w * fov;
          camera.rotation.x += dy / h * fov;
          // reset the position
          this.pan.x = x;
          this.pan.y = y;
        }
        break;
      case 'end':
        // clear the position
        this.pan = null;
    };
  };

  this.onWheel = function(event) {
    var camera = this.config.camera;
    // cancel the scroll
    event.preventDefault();
    this.activate();
    // get the feedback
    if (event.wheelDeltaY) {
      camera.fov -= event.wheelDeltaY * 0.05;
    } else if (event.wheelDelta) {
      camera.fov -= event.wheelDelta * 0.05;
    } else if (event.detail) {
      camera.fov += event.detail * 1.0;
    }
    // update the zoom
    camera.fov = Math.max(40, Math.min(100, camera.fov));
    camera.updateProjectionMatrix();
  };

  this.onPinch = function(phase, event) {
    var x, y, dx, dy,
      camera = this.config.camera,
      w = this.config.figure.offsetWidth,
      h = this.config.figure.offsetHeight;
    // cancel the drag
    event.preventDefault();
    // for every phase of the drag
    switch (phase) {
      case 'start':
        // store the start position
        this.zoom = {
          'x': Math.abs(event.touches[1].pageX - event.touches[0].pageX),
          'y': Math.abs(event.touches[1].pageY - event.touches[0].pageY)
        };
        break;
      case 'move':
        // if mouse is down
        if (this.zoom !== null) {
          // update the position
          x = Math.abs(event.touches[1].pageX - event.touches[0].pageX);
          y = Math.abs(event.touches[1].pageY - event.touches[0].pageY);
          dx = x - this.zoom.x;
          dy = y - this.zoom.y;
          // calculate the rotation
          camera.fov *= 1 - (dx / w + dy / h) / 2;
          // reset the position
          this.zoom.x = x;
          this.zoom.y = y;
        }
        // update the zoom
        camera.fov = Math.max(40, Math.min(100, camera.fov));
        camera.updateProjectionMatrix();
        break;
      case 'end':
        // clear the position
        this.zoom = null;
    };
  };

};

// extend the class
Photosphere.prototype.Loader = function(parent) {

    // PROPERTIES

    this.parent = parent;
    this.config = parent.config;

    // METHODS

    this.load = function(url, promises) {
        // store the promises
        this.promises = promises;
        // set up a promise to load the photo
        var loader = new THREE.TextureLoader();
        loader.load(
            url,
            this.onSuccess.bind(this),
            this.onUpdate.bind(this),
            this.onError.bind(this)
        );
    };

    // EVENTS

    this.onUpdate = function(xhr) {
        // calculate the progress
        var pct = Math.round(xhr.loaded / xhr.total * 100) + '%';
        // report it
        if (this.promises.update) { this.promises.update(pct); }
    };

    this.onError = function(xhr) {
        // determine what went wrong
        var error = xhr.target.status + ': ' + xhr.target.statusText;
        console.log('Photosphere loader:', error);
        // resolve the error promise
        if (this.promises.error) { this.promises.error(error); }
    };

    this.onSuccess = function(photo) {
        // complete the promise
        if (this.promises.complete) { this.promises.complete(photo); }
    };

};

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

// extend the class
Photosphere.prototype.Popup = function(parent) {

  // PROPERTIES

  this.parent = parent;
  this.config = parent.config;

  // METHODS

  this.show = function() {
    // if the popup doesn't exist
    if (!this.config.figure) {
      // create a container for the popup
      this.config.figure = document.createElement('figure');
      this.config.figure.className = (this.config.container === document.body) ?
        'photosphere-popup photosphere-popup-fixed photosphere-popup-passive' :
        'photosphere-popup photosphere-popup-passive';
      // add a close gadget
      this.addCloser();
      // add a locator gadget
      this.addLocator();
      // add the popup to the document
      this.config.container.appendChild(this.config.figure);
      // reveal the popup when ready
      setTimeout(this.onShow.bind(this), 0);
    }
  };

  this.hide = function() {
    // if there is a popup
    if (this.config.figure) {
      // unreveal the popup
      this.config.figure.className = this.config.figure.className.replace(/-active/gi, '-passive');
      // and after a while
      var _this = this;
      setTimeout(function() {
        // remove it
        _this.config.container.removeChild(_this.config.figure);
        // remove its reference
        _this.config.figure = null;
      }, 500);
    }
  };

  this.addCloser = function() {
    // build a close gadget
    var closer = document.createElement('a');
    closer.className = 'photosphere-closer';
    closer.innerHTML = 'x';
    closer.href = '#close';
    // add the close event handler
    closer.addEventListener('click', this.onHide.bind(this));
    closer.addEventListener('touchstart', this.onHide.bind(this));
    // add the close gadget to the image
    this.config.figure.appendChild(closer);
  };

  this.addLocator = function(url) {
    // only add if a handler was specified
    if (this.config.located) {
      // build the geo marker icon
      var locator = document.createElement('a');
      locator.className = 'photosphere-locator';
      locator.innerHTML = 'Show on a map';
      locator.href = '#map';
      // add the event handler
      locator.addEventListener('click', this.onLocate.bind(this));
      locator.addEventListener('touchstart', this.onLocate.bind(this));
      // add the location marker to the image
      this.config.figure.appendChild(locator);
    }
  };

  // EVENTS

  this.onShow = function() {
    // show the popup
    this.config.figure.className = this.config.figure.className.replace(/-passive/gi, '-active');
    // trigger the closed event if available
    if (this.config.opened) {
      this.config.opened(this.config.element);
    }
  };

  this.onHide = function(evt) {
    // cancel the click
    evt.preventDefault();
    // close the popup
    this.hide();
    // trigger the closed event if available
    if (this.config.closed) {
      this.config.closed(this.config.element);
    }
  };

  this.onLocate = function(evt) {
    // cancel the click
    evt.preventDefault();
    // trigger the located event if available
    if (this.config.located) {
      this.config.located(this.config.element);
    }
  };

};

// extend the class
Photosphere.prototype.Stage = function(parent) {

    // PROPERTIES

    this.parent = parent;
    this.config = parent.config;

    // METHODS

    this.create = function(photo) {
        this.createScene();
        this.createSphere(photo);
        this.render();
    };

    this.hasWebGL = function() {
        try {
            var canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    };

    this.createScene = function() {
        var width = this.config.figure.offsetWidth,
            height = this.config.figure.offsetHeight;
        // create the scene
        this.config.scene = new THREE.Scene();
        // create the camera
        this.config.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        this.config.camera.position.x = 0.1;
        this.config.camera.rotation.order = 'YXZ';
        // create the renderer
        this.config.renderer = this.hasWebGL() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.config.renderer.setSize(width, height);
        // insert the renderer into the page
        this.config.figure.appendChild(this.config.renderer.domElement);
    };

    this.createSphere = function(texture) {
        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 20, 20),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );
        sphere.scale.x = -1;
        this.config.scene.add(sphere);
    };

    // EVENTS

    this.render = function() {
        // if idle import a slight rotation
        this.config.camera.rotation.y += this.config.idle;
        // render the scene
        this.config.renderer.render(
            this.config.scene,
            this.config.camera
        );
        // next iteration
        requestAnimationFrame(
            this.render.bind(this)
        );
    };

    return this;

};
