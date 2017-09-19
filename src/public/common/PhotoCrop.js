'use strict';

define([
    "skylark/langx",
    "./partial",
    "jquery",
    "handlebars",
    "cropper"
], function(langx, partial, $, handlebars, Cropper) {
    return langx.Evented.inherit({
        klassName: "PhotoCrop",
        cropper: null,
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

        start: function(callback) {
            //Get file
            var dom = this.dom,
                self = this;
            dom.find('input[id=lefile]').change(handleImage);
            var $img = dom.find(".js-image-editor");

            function handleImage(e) {
                console.log("file function");
                var $input = $(this);
                var inputFiles = this.files;
                if (inputFiles == undefined || inputFiles.length == 0) return;
                var inputFile = inputFiles[0];
                var reader = new FileReader();
                reader.onload = function(e) {
                    $img.attr("src", e.target.result);
                    if (self.cropper) self.cropper.destroy();
                    self.cropper = makeCropper();
                };
                reader.onerror = function(e) {
                    alert("I AM ERROR: " + e.target.error.code);
                };
                reader.readAsDataURL(inputFile);
            }

            function makeCropper() {
                return new Cropper($img[0], {
                    autoCrop: true,
                    minCropBoxWidth: 128,
                    minCropBoxHeight: 128,
                    cropBoxResizable: false,
                    minContainerWidth: 128,
                    minContainerHeight: 128,
                    minCanvasWidth: 128,
                    viewMode: 1,
                    minCanvasHeight: 128,
                    ready: function(e) {
                        debugger;
                        console.log(e.type);
                    },
                    crop: function(e) {
                        var data = e.target.cropper.getCroppedCanvas({
                                width: 128,
                                height: 128
                            }),
                            parent = dom.find(".js-image-preview").empty().data("cropped", true);
                        $("<img>").attr("src", data.toDataURL('image/jpeg')).appendTo(parent);
                    }
                });
            }
            return $img;
        }
    });
});
