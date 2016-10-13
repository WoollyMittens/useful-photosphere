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
useful.PhotoSphere.prototype.Loader = function(context) {

    "use strict";

    // properties

    this.context = context;
    this.model = context.model;

    // methods

    this.load = function(url, promise) {
        // display the progress bar
        this.bar = document.createElement('span');
        this.bar.className = '--progress';
        this.chart = document.createElement('span');
        this.chart.innerHTML = '0%';
        this.bar.appendChild(this.chart);
        this.model.figure.appendChild(this.bar);
        // set up a promise to load the photo
        var loader = new THREE.TextureLoader();
        loader.load(
            url,
            this.onSuccess.bind(this, promise),
            this.onUpdate.bind(this),
            this.onError.bind(this)
        );
    };

    // events

    this.onUpdate = function(xhr) {
        // calculate the progress
        var pct = Math.round(xhr.loaded / xhr.total * 100) + '%';
        // update the progress bar
        this.chart.innerHTML = pct;
        this.chart.style.width = pct;
    };

    this.onError = function(xhr) {
        // display a message in the progress bar
        this.model.figure.className += ' --error';
        this.chart.innerHTML = 'Error';
        this.chart.style.width = '100%';
    };

    this.onSuccess = function(promise, photo) {
        // hide the progress bar
        this.model.figure.removeChild(this.bar, true);
        // complete the promise
        promise(photo);
    };

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.PhotoSphere.Loader;
}
