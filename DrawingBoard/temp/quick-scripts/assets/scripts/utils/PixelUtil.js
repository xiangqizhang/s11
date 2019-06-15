(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/utils/PixelUtil.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fbd1bFX/XVFbYcD4l2TP7DL', 'PixelUtil', __filename);
// scripts/utils/PixelUtil.ts

Object.defineProperty(exports, "__esModule", { value: true });
//目标图像尺寸
var judgeSize = new cc.Size(28, 28);
var PixelUtil = /** @class */ (function () {
    function PixelUtil() {
    }
    //翻转图像y轴
    PixelUtil.prototype.filpYImage = function (data, size) {
        var width = size.width;
        var height = size.height;
        var picData = new Uint8Array(width * height * 4);
        var idx = 0;
        for (var row = height - 1; row >= 0; --row) {
            for (var col = 0; col < width * 4; ++col) {
                picData[idx++] = data[row * width * 4 + col];
            }
        }
        return picData;
    };
    /**
     *
     * @param pixelsData 像素数据
     * @param size 像素数据size
     */
    PixelUtil.prototype.scalePixels = function (pixelsData, size) {
        var width = size.width;
        var height = size.height;
        var pixels = pixelsData;
        //像素缩放
        var scaleX = Math.floor(width / (judgeSize.width - 1));
        var scaleY = Math.floor(height / (judgeSize.height - 1));
        var outputData = [];
        for (var row = 0; row < judgeSize.height; ++row) {
            for (var col = 0; col < judgeSize.width; ++col) {
                var toRow = row * scaleY * width * 4;
                var toCol = col * scaleX * 4;
                outputData.push(pixels[toRow + toCol + 0]);
                outputData.push(pixels[toRow + toCol + 1]);
                outputData.push(pixels[toRow + toCol + 2]);
                outputData.push(pixels[toRow + toCol + 3]);
            }
        }
        return outputData;
    };
    /**
     * 转换到指定尺寸灰度图
     * @param pixelsData 像素数据
     * @param dataSize 像素数据size
     * @param targetSize 转换目标size
     */
    PixelUtil.prototype.grayPixels = function (pixelsData, dataSize, targetSize) {
        var width = dataSize.width;
        var height = dataSize.height;
        //灰度化
        var pixels = pixelsData;
        var grayData = [];
        for (var i = 0; i < pixels.length; i += 4) {
            var r = pixels[i];
            var g = pixels[i + 1];
            var b = pixels[i + 2];
            var gray = (r * 30 + g * 59 + b * 11) / 100;
            grayData.push(gray);
        }
        //缩放
        var scaleX = Math.floor(width / (targetSize.width - 1));
        var scaleY = Math.floor(height / (targetSize.height - 1));
        var outputData = [];
        for (var row = 0; row < targetSize.height; ++row) {
            for (var col = 0; col < judgeSize.width; ++col) {
                var toRow = row * scaleY * width;
                var toCol = col * scaleX;
                outputData.push(pixels[toRow + toCol]);
            }
        }
        return outputData;
    };
    /**
     * 将数组转为Uint8ClampedArray
     * @param data 数组
     */
    PixelUtil.prototype.convertToUint8ClampedArray = function (data) {
        var u8carr = new Uint8ClampedArray(data.length);
        for (var i = 0; i < data.length; ++i) {
            u8carr[i] = data[i + 1];
        }
        return u8carr;
    };
    PixelUtil.judegSize = new cc.Size(28, 28);
    return PixelUtil;
}());
exports.default = new PixelUtil();

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=PixelUtil.js.map
        