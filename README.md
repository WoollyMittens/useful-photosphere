# useful.photoshere.js: Projected Spherical Image

Displays a rotating projection of a spherical image.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-spherical">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/useful-photoshere.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful-photoshere.js"></script>
```

## Dependencies

This script relies on the ThreeJS library from https://threejs.org/

## How to start the script

```javascript
var photoSphere = new useful.PhotoSphere().init({
	'figure' : document.querySelector('.useful-photosphere'),
	'idle': 0.002
});
```

**figure : {DOM node}** - A DOM node to be processed into a spherical display.

**idle : {float}** - The steps in radians to rotate when idle.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp prod` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8000/ .

## License

This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
