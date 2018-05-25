# useful.photoshere.js: Projected Spherical Image

Displays a rotating projection of a spherical image.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-photosphere">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/photosphere.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/photosphere.js"></script>
```

## How to start the script

```javascript
var photoSphere = new PhotoSphere({
	// target elements
	'elements': document.querySelectorAll('#photosphere a'),
	// restrict the popup to a container
	'container' : document.body,
	// optional webservice for acquiring sized images
	'slicer' : 'php/imageslice.php?src=../{src}&{size}',
	// rotation speed when idle
	'idle': 0.002
});
```

**'elements' : {array}** - A collection of target elements.

**'container' : {element}** - Restrict the popup to a container.

**'slicer' : {string}** - Optional web-service for resizing images. An example is provided as *./php/imageslice.php*.

**idle : {float}** - The steps in radians to rotate when idle.

## How to build the script

This project uses three.js from https://threejs.org/

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
