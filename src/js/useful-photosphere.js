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

    this.model = model;

    // views

    this.stage = new this.Stage(this);
    this.controls = new this.Controls(this);

    // controller

    this.loadPhoto = function(url) {
        // set up a promise to load the photo
        var loader = new THREE.TextureLoader();
        loader.load(
            url,
            this.onLoadPhoto.bind(this),
            function(xhr) { console.log((xhr.loaded / xhr.total * 100) + '% loaded'); },
            function(xhr) { console.log('An error happened'); }
        );
    };

    this.onLoadPhoto = function(photo) {
        // create the required elements
        this.stage.create(photo);
        this.controls.implement();
    };

    this.loadPhoto(
        this.model.figure.getAttribute('data-src')
    );

    return this;

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.PhotoSphere;
}
