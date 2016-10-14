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
useful.PhotoSphere.prototype.Controls = function(context) {

    "use strict";

    // properties

    this.context = context;
    this.model = context.model;
    this.pan = null;
    this.zoom = null;

    // methods

    this.implement = function() {
        // mouse
        this.model.figure.addEventListener('mousewheel', this.onWheel.bind(this), false);
        this.model.figure.addEventListener('DOMMouseScroll', this.onWheel.bind(this), false);
        this.model.figure.addEventListener('mousedown', this.onDrag.bind(this, 'start'));
        this.model.figure.addEventListener('mousemove', this.onDrag.bind(this, 'move'));
        document.body.addEventListener('mouseup', this.onDrag.bind(this, 'end'));
        // touch
        this.model.figure.addEventListener('touchstart', this.onTouch.bind(this, 'start'));
        this.model.figure.addEventListener('touchmove', this.onTouch.bind(this, 'move'));
        document.body.addEventListener('touchend', this.onTouch.bind(this, 'end'));
    };

    this.activate = function () {
        // flag the component active
        this.model.figure.className += ' active';
        // remove the idle animation
        this.model.idle = 0;
        // destroy this function
        this.active = function () {};
    };

    // events

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
            camera = this.model.camera,
            w = this.model.figure.offsetWidth,
            h = this.model.figure.offsetHeight,
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
        var camera = this.model.camera;
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
            camera = this.model.camera,
            w = this.model.figure.offsetWidth,
            h = this.model.figure.offsetHeight;
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

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.PhotoSphere.Controls;
}
