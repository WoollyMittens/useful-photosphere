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
