(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/draw_node.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1be8brUtTpA1Y6pJBM+CcGI', 'draw_node', __filename);
// scripts/draw_node.ts

Object.defineProperty(exports, "__esModule", { value: true });
var PixelUtil_1 = require("./utils/PixelUtil");
/**
 * 画板
 */
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
//目标图像尺寸
var judgeSize = new cc.Size(28, 28);
var DrawNode = /** @class */ (function (_super) {
    __extends(DrawNode, _super);
    function DrawNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //预览node
        _this.priviewNode = null;
        //截图camera
        _this.camera = null;
        //绘图组件
        _this.graphics = null;
        _this.renderTexture = null;
        _this._pixelsData = null;
        return _this;
    }
    DrawNode.prototype.onLoad = function () {
        this.initPaintbrush();
        this.setTouchCtrl();
    };
    /**
     * 初始化画笔属性
     */
    DrawNode.prototype.initPaintbrush = function () {
        //graphics
        this.graphics = this.node.getComponent(cc.Graphics);
        //画笔颜色
        this.graphics.strokeColor = cc.color(255, 255, 255);
        //画笔粗细
        this.graphics.lineWidth = 18;
        //交点样式
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        //结束点样式
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
        //填充黑色背景
        this.fillBackgroundColor();
    };
    DrawNode.prototype.fillBackgroundColor = function () {
        //填充黑色背景
        var pos = this.node.convertToWorldSpace(cc.v2(0, 0));
        var origin = this.node.convertToNodeSpaceAR(pos);
        this.graphics.fillColor = new cc.Color(0, 0, 0);
        this.graphics.fillRect(origin.x, origin.y, this.node.width, this.node.width);
    };
    /**
     * 绘制完成后
     */
    DrawNode.prototype.onFinishDraw = function () {
        var size = this.node.getContentSize();
        var width = size.width;
        var height = size.height;
        var renderTexture = this.screenshot();
        var pixelsData = PixelUtil_1.default.filpYImage(renderTexture.readPixels(), size);
        renderTexture.destroy();
        renderTexture = this.renderTexture = new cc.RenderTexture();
        this.renderTexture.initWithData(pixelsData, cc.Texture2D.PixelFormat.RGBA8888, width, height);
        //更新预览图
        this.priviewNode.width = width / 2;
        this.priviewNode.height = height / 2;
        this.priviewNode.active = true;
        this.priviewNode.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(renderTexture);
        this._pixelsData = pixelsData;
        //FIXME: DEBUG
        var scalePixels = PixelUtil_1.default.scalePixels(this._pixelsData, this.node.getContentSize());
        // width = 28,height = 28;
        // {
        //     let str = '';
        //     let j = 0;
        //     for (let i = 0; i < this._pixelsData.length; i+=4) {
        //         str += this._pixelsData[i] + ' '
        //         if(j >= width * 4){
        //             console.log(str + new Date().getTime() + Math.random());
        //             j = 0;
        //             str = '';
        //         }
        //         ++j;
        //     }
        // }
        // for(let i = 0;i<height;++i){
        //     let str = '';
        //     for(let j = 0;j<width*4;j+=4){
        //         str+= scalePixels[i * width * 4 + j] + ' ';
        //     }
        //     console.log(str + new Date().getTime() + Math.random());
        // }
    };
    DrawNode.prototype.getPixelsData = function () {
        return PixelUtil_1.default.scalePixels(this._pixelsData, this.node.getContentSize());
    };
    //截图
    DrawNode.prototype.screenshot = function () {
        var width = this.node.width;
        var height = this.node.height;
        this.camera.node.active = true;
        if (this.renderTexture != null) {
            this.renderTexture.destroy();
        }
        // 截图
        var defaultTexture = new cc.RenderTexture();
        defaultTexture.initWithSize(width, height);
        this.camera.targetTexture = defaultTexture;
        this.camera.render(null);
        this.camera.node.active = false;
        return this.renderTexture = defaultTexture;
    };
    //清屏按钮回调
    DrawNode.prototype.callbackCleanStroke = function () {
        this.graphics.clear();
        this.fillBackgroundColor();
        this.onFinishDraw();
    };
    /**********************************  触摸相关  **************************************/
    DrawNode.prototype.setTouchCtrl = function () {
        this.node.on(cc.Node.EventType.TOUCH_START.toString(), this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE.toString(), this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END.toString(), this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL.toString(), this.onTouchCancel, this);
    };
    /**
     * 触摸点限制在触摸区域内
     * @param rect 区域
     * @param loc 触摸点
     */
    DrawNode.prototype.resetTouchPoint = function (rect, loc) {
        if (!rect.contains(loc)) {
            if (loc.x < rect.x)
                loc.x = rect.x;
            else if (loc.x > rect.x + rect.width)
                loc.x = rect.x + rect.width;
            if (loc.y < rect.y)
                loc.y = rect.y;
            else if (loc.y > rect.y + rect.height)
                loc.y = rect.y + rect.height;
        }
        return loc;
    };
    DrawNode.prototype.onTouchStart = function (eventTouch) {
        var loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
    };
    DrawNode.prototype.onTouchMove = function (eventTouch) {
        var loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        var rect = this.node.getBoundingBox();
        var pos = this.node.convertToWorldSpace(cc.v2(0, 0));
        var origin = this.node.convertToNodeSpaceAR(pos);
        rect.x = origin.x;
        rect.y = origin.y;
        //设置边界
        if (!rect.contains(loc)) {
            loc = this.resetTouchPoint(rect, loc);
        }
        var previousLocation = this.resetTouchPoint(rect, this.node.convertToNodeSpaceAR(eventTouch.getPreviousLocation()));
        this.graphics.moveTo(previousLocation.x, previousLocation.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
    };
    DrawNode.prototype.onTouchEnd = function (eventTouch) {
        var loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
        //触摸结束后调用
        this.onFinishDraw();
    };
    DrawNode.prototype.onTouchCancel = function (eventTouch) {
        var loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
        //触摸结束后调用
        this.onFinishDraw();
    };
    __decorate([
        property(cc.Node)
    ], DrawNode.prototype, "priviewNode", void 0);
    __decorate([
        property(cc.Camera)
    ], DrawNode.prototype, "camera", void 0);
    DrawNode = __decorate([
        ccclass
    ], DrawNode);
    return DrawNode;
}(cc.Component));
exports.default = DrawNode;

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
        //# sourceMappingURL=draw_node.js.map
        