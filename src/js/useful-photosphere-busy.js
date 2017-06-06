/*
	Source:
	van Creij, Maurice (2014). "useful.photozoom.js: Overlays a full screen preview of a thumbnail", version 20141127, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// create the constructor if needed
var useful = useful || {};
useful.Photosphere = useful.Photosphere || function () {};

// extend the constructor
useful.Photosphere.prototype.Busy = function (container) {

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

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = useful.Photosphere.Busy;
}
