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
