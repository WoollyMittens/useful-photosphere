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
useful.PhotoSphere.prototype.Stage = function(context) {

    "use strict";

    // properties

    this.context = context;
    this.model = context.model;

    // methods

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
        var width = this.model.figure.offsetWidth,
            height = this.model.figure.offsetHeight;
        // create the scene
        this.model.scene = new THREE.Scene();
        // create the camera
        this.model.camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
        this.model.camera.position.x = 0.1;
        this.model.camera.rotation.order = 'YXZ';
        // create the renderer
        this.model.renderer = this.hasWebGL() ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
        this.model.renderer.setSize(width, height);
        // insert the renderer into the page
        this.model.figure.appendChild(this.model.renderer.domElement);
    };

    this.createSphere = function(texture) {
        var sphere = new THREE.Mesh(
            new THREE.SphereGeometry(100, 20, 20),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );
        sphere.scale.x = -1;
        this.model.scene.add(sphere);
    };

    // events

    this.render = function() {
        // if idle import a slight rotation
        this.model.camera.rotation.y += this.model.idle;
        // render the scene
        this.model.renderer.render(
            this.model.scene,
            this.model.camera
        );
        // next iteration
        requestAnimationFrame(
            this.render.bind(this)
        );
    };

    return this;

};

// return as a require.js module
if (typeof module !== 'undefined') {
    exports = module.exports = useful.PhotoSphere.Stage;
}
