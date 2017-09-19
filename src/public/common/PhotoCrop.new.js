'use strict';

define([
    "skylark/langx",
    "./partial",
    "jquery",
    "handlebars"
], function(langx, partial, $, handlebars) {

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    /**
     * @file Allows uploading, cropping (with automatic resizing) and exporting
     * of images.
     * @author Billy Brown
     * @license MIT
     * @version 2.1.0
     */

    /** Class used for uploading images. */

    var Uploader = function() {
        /**
         * <p>Creates an Uploader instance with parameters passed as an object.</p>
         * <p>Available parameters are:</p>
         * <ul>
         *  <li>exceptions {function}: the exceptions handler to use, function that takes a string.</li>
         *  <li>input {HTMLElement} (required): the file input element. Instantiation fails if not provided.</li>
         *  <li>types {array}: the file types accepted by the uploader.</li>
         * </ul>
         *
         * @example
         * var uploader = new Uploader({
         *  input: document.querySelector('.js-fileinput'),
         *  types: [ 'gif', 'jpg', 'jpeg', 'png' ]
         * });
         * *
         * @param {object} options the parameters to be passed for instantiation
         */

        function Uploader(options) {
            _classCallCheck(this, Uploader);

            if (!options.input) {
                throw '[Uploader] Missing input file element.';
            }
            this.fileInput = options.input;
            this.types = options.types || ['gif', 'jpg', 'jpeg', 'png'];
        }

        /**
         * Listen for an image file to be uploaded, then validate it and resolve with the image data.
         */

        Uploader.prototype.listen = function listen(resolve, reject) {
            var _this = this;

            this.fileInput.onchange = function(e) {
                // Do not submit the form
                e.preventDefault();

                // Make sure one file was selected
                if (!_this.fileInput.files || _this.fileInput.files.length !== 1) {
                    reject('[Uploader:listen] Select only one file.');
                }

                var file = _this.fileInput.files[0];
                var reader = new FileReader();
                // Make sure the file is of the correct type
                if (!_this.validFileType(file.type)) {
                    reject('[Uploader:listen] Invalid file type: ' + file.type);
                } else {
                    // Read the image as base64 data
                    reader.readAsDataURL(file);
                    // When loaded, return the file data
                    reader.onload = function(e) {
                        return resolve(e.target.result);
                    };
                }
            };
        };

        /** @private */

        Uploader.prototype.validFileType = function validFileType(filename) {
            // Get the second part of the MIME type
            var extension = filename.split('/').pop().toLowerCase();
            // See if it is in the array of allowed types
            return this.types.includes(extension);
        };

        return Uploader;
    }();

    function squareContains(square, coordinate) {
        return coordinate.x >= square.pos.x && coordinate.x <= square.pos.x + square.size.x && coordinate.y >= square.pos.y && coordinate.y <= square.pos.y + square.size.y;
    }

    /** Class for cropping an image. */

    var Cropper = function() {
        /**
         * <p>Creates a Cropper instance with parameters passed as an object.</p>
         * <p>Available parameters are:</p>
         * <ul>
         *  <li>size {object} (required): the dimensions of the cropped, resized image. Must have 'width' and 'height' fields. </li>
         *  <li>limit {integer}: the longest side that the cropping area will be limited to, resizing any larger images.</li>
         *  <li>canvas {HTMLElement} (required): the cropping canvas element. Instantiation fails if not provided.</li>
         *  <li>preview {HTMLElement} (required): the preview canvas element. Instantiation fails if not provided.</li>
         * </ul>
         *
         * @example
         * var editor = new Cropper({
         *  size: { width: 128, height: 128 },
         *  limit: 600,
         *  canvas: document.querySelector('.js-editorcanvas'),
         *  preview: document.querySelector('.js-previewcanvas')
         * });
         *
         * @param {object} options the parameters to be passed for instantiation
         */

        function Cropper(options) {
            _classCallCheck(this, Cropper);

            // Check the inputs
            if (!options.size) {
                throw 'Size field in options is required';
            }
            if (!options.canvas) {
                throw 'Could not find image canvas element.';
            }
            if (!options.preview) {
                throw 'Could not find preview canvas element.';
            }
            this.scale = 1.0;
            // Hold on to the values
            this.imageCanvas = options.canvas;
            this.previewCanvas = options.preview;
            this.c = this.imageCanvas.getContext("2d");
            // Images larger than options.limit are resized
            this.limit = options.limit || 600; // default to 600px
            // Create the cropping square with the handle's size
            this.crop = {
                size: { x: options.size.width, y: options.size.height },
                pos: { x: 0, y: 0 },
                handleSize: 10
            };

            // Set the preview canvas size
            this.previewCanvas.width = options.size.width;
            this.previewCanvas.height = options.size.height;

            // Bind the methods, ready to be added and removed as events
            this.boundDrag = this.drag.bind(this);
            this.boundClickStop = this.clickStop.bind(this);
        }

        /**
         * Set the source image data for the cropper.
         *
         * @param {String} source the source of the image to crop.
         */

        Cropper.prototype.setImageSource = function setImageSource(source) {
            var _this2 = this;

            this.image = new Image();
            this.image.src = source;
            this.image.onload = function(e) {
                // Perform an initial render
                _this2.render();
                // Listen for events on the canvas when the image is ready
                _this2.imageCanvas.onmousedown = _this2.clickStart.bind(_this2);
            };
        };

        /**
         * Export the result to a given image tag.
         *
         * @param {HTMLElement} img the image tag to export the result to.
         */

        Cropper.prototype.export = function _export(img) {
            img.setAttribute('src', this.previewCanvas.toDataURL());
        };

        /** @private */

        Cropper.prototype.render = function render() {
            // Resize the original to the maximum allowed size
            var ratio = this.limit / Math.max(this.image.width, this.image.height);
            this.image.width *= ratio * this.scale;
            this.image.height *= ratio * this.scale;
            if (this.image.width <= this.crop.size.x) return;
            if (this.image.height > this.limit) return;
            this.c.clearRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);
            this.displayImage();
            this.preview();
            this.drawCropWindow();
        };

        /** @private */

        Cropper.prototype.clickStart = function clickStart(e) {
            // Get the click position and hold onto it for the expected mousemove
            var position = { x: e.offsetX, y: e.offsetY };
            this.lastEvent = {
                position: position,
                resizing: this.isResizing(position),
                moving: this.isMoving(position)
            };
            // Listen for mouse movement and mouse release
            this.imageCanvas.addEventListener('mousemove', this.boundDrag);
            this.imageCanvas.addEventListener('mouseup', this.boundClickStop);
        };

        /** @private */

        Cropper.prototype.clickStop = function clickStop(e) {
            // Stop listening for mouse movement and mouse release
            this.imageCanvas.removeEventListener("mousemove", this.boundDrag);
            this.imageCanvas.removeEventListener("mouseup", this.boundClickStop);
        };

        /** @private */

        Cropper.prototype.isResizing = function isResizing(coord) {
            var size = this.crop.handleSize;
            var handle = {
                pos: {
                    x: this.crop.pos.x + this.crop.size.x - size / 2,
                    y: this.crop.pos.y + this.crop.size.y - size / 2
                },
                size: { x: size, y: size }
            };
            return squareContains(handle, coord);
        };

        /** @private */

        Cropper.prototype.isMoving = function isMoving(coord) {
            return squareContains(this.crop, coord);
        };

        /** @private */

        Cropper.prototype.drag = function drag(e) {
            var position = {
                x: e.offsetX,
                y: e.offsetY
            };
            // Calculate the distance that the mouse has travelled
            var dx = position.x - this.lastEvent.position.x;
            var dy = position.y - this.lastEvent.position.y;
            // Determine whether we are resizing, moving, or nothing
            if (this.lastEvent.resizing) {
                this.resize(dx, dy);
            } else if (this.lastEvent.moving) {
                this.move(dx, dy);
            }
            // Update the last position
            this.lastEvent.position = position;
            this.render();
        };

        /** @private */

        Cropper.prototype.resize = function resize(dx, dy) {
            var handle = {
                x: this.crop.pos.x + this.crop.size.x,
                y: this.crop.pos.y + this.crop.size.y
            };
            // Maintain the aspect ratio
            var amount = Math.abs(dx) > Math.abs(dy) ? dx : dy;
            // Make sure that the handle remains within image bounds
            if (this.inBounds(handle.x + amount, handle.y + amount)) {
                this.crop.size.x += amount;
                this.crop.size.y += amount;
            }
        };

        /** @private */

        Cropper.prototype.move = function move(dx, dy) {
            // Get the opposing coordinates
            var tl = {
                x: this.crop.pos.x,
                y: this.crop.pos.y
            };
            var br = {
                x: this.crop.pos.x + this.crop.size.x,
                y: this.crop.pos.y + this.crop.size.y
            };
            // Make sure they are in bounds
            if (this.inBounds(tl.x + dx, tl.y + dy) && this.inBounds(br.x + dx, tl.y + dy) && this.inBounds(br.x + dx, br.y + dy) && this.inBounds(tl.x + dx, br.y + dy)) {
                this.crop.pos.x += dx;
                this.crop.pos.y += dy;
            }
        };

        /** @private */

        Cropper.prototype.displayImage = function displayImage() {
            // Fit the image to the canvas
            this.imageCanvas.width = this.image.width;
            this.imageCanvas.height = this.image.height;
            this.c.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        };

        /** @private */

        Cropper.prototype.drawCropWindow = function drawCropWindow() {
            var pos = this.crop.pos;
            var size = this.crop.size;
            var radius = this.crop.handleSize / 2;
            this.c.strokeStyle = 'red';
            this.c.fillStyle = 'red';
            // Draw the crop window outline
            this.c.strokeRect(pos.x, pos.y, size.x, size.y);
            // Draw the draggable handle
            var path = new Path2D();
            // path.arc(pos.x + size.x, pos.y + size.y, radius, 0, Math.PI * 2, true);
            path.arc(0, 0, radius, 0, Math.PI * 2, true);
            this.c.fill(path);
        };

        /** @private */

        Cropper.prototype.preview = function preview() {
            var pos = this.crop.pos;
            var size = this.crop.size;
            // Fetch the image data from the canvas
            var imageData = this.c.getImageData(pos.x, pos.y, size.x, size.y);
            if (!imageData) {
                return false;
            }
            // Prepare and clear the preview canvas
            var ctx = this.previewCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
            // Draw the image to the preview canvas, resizing it to fit
            ctx.drawImage(this.imageCanvas,
                // Top left corner coordinates of image
                pos.x, pos.y,
                // Width and height of image
                size.x, size.y,
                // Top left corner coordinates of result in canvas
                0, 0,
                // Width and height of result in canvas
                this.previewCanvas.width, this.previewCanvas.height);
        };

        /** @private */

        Cropper.prototype.inBounds = function inBounds(x, y) {
            return squareContains({
                pos: { x: 0, y: 0 },
                size: {
                    x: this.imageCanvas.width,
                    y: this.imageCanvas.height
                }
            }, { x: x, y: y });
        };

        Cropper.prototype.zoom = function() {
            var canvas = this.imageCanvas;
            var self = this;

            var scaleMultiplier = 0.9;

            function draw(scale) {
                self.render();
            }
            return {
                draw: draw,
                in: function() {
                    self.scale *= scaleMultiplier;
                    draw(self.scale);
                },
                out: function() {
                    self.scale /= scaleMultiplier;
                    draw(self.scale);
                }
            }
        };

        Cropper.prototype.rotated = function() {
            var self = this;
            this._angleInDegrees = this._angleInDegrees || 0;
            var canvas = this.imageCanvas;
            var ctx = this.imageCanvas.getContext('2d');

            function draw(dgrees) {
                var ratio = self.limit / Math.max(self.image.width, self.image.height);
                self.image.width *= ratio * self.scale;
                self.image.height *= ratio * self.scale;
                if (self.image.width <= self.crop.size.x) return;
                if (self.image.height > self.limit) return;
                self.c.clearRect(0, 0, self.imageCanvas.width, self.imageCanvas.height);
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(dgrees * Math.PI / 180);
                ctx.save();
                self.displayImage();
                self.preview();
                self.drawCropWindow();
                ctx.restore();
            };

            return {
                left: function() {
                    self._angleInDegrees += 90;
                    draw(self._angleInDegrees);
                },
                right: function() {
                    self._angleInDegrees -= 90;
                    draw(self._angleInDegrees);
                }
            };
        }

        return Cropper;
    }();

    function exceptionHandler(message) {
        console.log(message);
    }

    return langx.Evented.inherit({
        klassName: "PhotoCrop",
        init: function(selector, cropSize) {
            this.cropSize = cropSize || { width: 120, height: 120 };
            this.dom = this._buildDom().appendTo(selector);
        },

        _buildDom: function() {
            partial.get("photo-crop-partial");
            var tpl = handlebars.compile("{{> photo-crop-partial}}");
            this.tpl = tpl();
            return $("<div>").html(this.tpl);
        },

        start: function() {
            // Auto-resize the cropped image
            var dimensions = this.cropSize;
            var self = this;
            try {
                var uploader = new Uploader({
                    input: this.dom.find('.js-fileinput')[0],
                    types: ['gif', 'jpg', 'jpeg', 'png']
                });
                var editor = new Cropper({
                    size: dimensions,
                    canvas: this.dom.find('.js-editorcanvas')[0],
                    preview: this.dom.find('.js-previewcanvas')[0]
                });

                this.dom.find(".action-btns").delegate("i.item", "click", function(e) {
                    var actions = $(e.target).data().action.split("-");
                    editor[actions[0]]()[actions[1]](actions[1]);
                }).hide();

                // Make sure both were initialised correctly
                if (uploader && editor) {
                    // Start the uploader, which will launch the editor
                    uploader.listen(function(data) {
                        self.dom.find(".action-btns").show();
                        editor.setImageSource(data);
                    }, function(error) {
                        throw error;
                    });
                }
                return {
                    status: true,
                    data: editor.previewCanvas.toDataURL()
                };

            } catch (error) {
                exceptionHandler(error.message);
                return {
                    status: false
                };
            }
        }
    });
});
