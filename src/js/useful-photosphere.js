/*
	Source:
	van Creij, Maurice (2016). "useful.photosphere.js: Projected Photoshere Image", version 20161013, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.PhotoSphere = useful.PhotoSphere || function() {};

// extend the constructor
useful.PhotoSphere.prototype.init = function(model) {

    "use strict";

    // model

    this.model = {
        'idle': -0.002
    };

    for (name in model) {
        this.model[name] = model[name];
    }

    // views

    this.stage = new this.Stage(this);
    this.controls = new this.Controls(this);
    this.loader = new this.Loader(this);

    // controller

    this.onComplete = function(photo) {
        this.stage.create(photo);
        this.controls.implement();
    };

    this.loader.load(
        this.model.figure.getAttribute('data-src'),
        this.onComplete.bind(this)
    );

    return this;

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.PhotoSphere;
}
