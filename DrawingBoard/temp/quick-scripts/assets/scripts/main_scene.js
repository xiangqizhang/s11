(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/main_scene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '80b01a8WM9GKbf6VvMskqyc', 'main_scene', __filename);
// scripts/main_scene.ts

Object.defineProperty(exports, "__esModule", { value: true });
var PixelUtil_1 = require("./utils/PixelUtil");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var modelUrl = 'http://127.0.0.1:8080/tensorflow_model/model.json';
var tensorflow_model = null;
var MainScene = /** @class */ (function (_super) {
    __extends(MainScene, _super);
    function MainScene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw_node = null;
        _this.resutlt_label = null;
        _this.drawNodeScr = null;
        return _this;
    }
    MainScene.prototype.onLoad = function () {
        this.drawNodeScr = this.draw_node.getComponent('draw_node');
        function load() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, tf.loadLayersModel(modelUrl)];
                        case 1:
                            tensorflow_model = _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        }
        load();
    };
    MainScene.prototype.runTensorflow = function () {
        if (tensorflow_model == null) {
            cc.error('tensorflow_model is null !');
            return;
        }
        var drawNodeScr = this.drawNodeScr;
        var pixelsData = drawNodeScr.getPixelsData();
        var pixels = PixelUtil_1.default.convertToUint8ClampedArray(pixelsData);
        var imgData = new ImageData(pixels, 28, 28);
        var img = tf.browser.fromPixels(imgData, 1);
        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, 'float32');
        var predict = tensorflow_model.predict(img);
        var predictions = Array.from(predict.dataSync());
        var maxProb = 0;
        var number;
        predictions.forEach(function (prob, num) {
            if (prob > maxProb) {
                maxProb = prob;
                number = num;
            }
        });
        this.resutlt_label.string = number;
    };
    __decorate([
        property(cc.Node)
    ], MainScene.prototype, "draw_node", void 0);
    __decorate([
        property(cc.Label)
    ], MainScene.prototype, "resutlt_label", void 0);
    MainScene = __decorate([
        ccclass
    ], MainScene);
    return MainScene;
}(cc.Component));
exports.default = MainScene;

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
        //# sourceMappingURL=main_scene.js.map
        