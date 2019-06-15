import PixelUtil from "./utils/PixelUtil";

/**
 * 画板
 */

const {
    ccclass,
    property
} = cc._decorator;

//目标图像尺寸
const judgeSize = new cc.Size(28, 28);

@ccclass
export default class DrawNode extends cc.Component {

    //预览node
    @property(cc.Node)
    private priviewNode: cc.Node = null;

    //截图camera
    @property(cc.Camera)
    private camera: cc.Camera = null;

    //绘图组件
    private graphics: cc.Graphics = null;

    private renderTexture: cc.RenderTexture = null;

    private _pixelsData = null;

    onLoad() {
        this.initPaintbrush();
        this.setTouchCtrl();
    }

    /**
     * 初始化画笔属性
     */
    initPaintbrush() {
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
    }

    fillBackgroundColor() {
        //填充黑色背景
        let pos = this.node.convertToWorldSpace(cc.v2(0, 0));
        let origin = this.node.convertToNodeSpaceAR(pos);
        this.graphics.fillColor = new cc.Color(0, 0, 0);
        this.graphics.fillRect(origin.x, origin.y, this.node.width, this.node.width);
    }

    /**
     * 绘制完成后
     */
    onFinishDraw() {
        let size = this.node.getContentSize();
        let width = size.width;
        let height = size.height;
        let renderTexture = this.screenshot();

        let pixelsData = PixelUtil.filpYImage(renderTexture.readPixels(), size);
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

        let scalePixels = PixelUtil.scalePixels(this._pixelsData, this.node.getContentSize());
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
    }

    getPixelsData() {
        return PixelUtil.scalePixels(this._pixelsData, this.node.getContentSize())
    }

    //截图
    screenshot(): cc.RenderTexture {
        let width = this.node.width;
        let height = this.node.height;
        this.camera.node.active = true;
        if (this.renderTexture != null) {
            this.renderTexture.destroy();
        }
        // 截图
        let defaultTexture = new cc.RenderTexture();
        defaultTexture.initWithSize(width, height);

        this.camera.targetTexture = defaultTexture;
        this.camera.render(null);
        this.camera.node.active = false;

        return this.renderTexture = defaultTexture;
    }

    //清屏按钮回调
    callbackCleanStroke() {
        this.graphics.clear();
        this.fillBackgroundColor();
        this.onFinishDraw();
    }

    /**********************************  触摸相关  **************************************/

    setTouchCtrl() {
        this.node.on(cc.Node.EventType.TOUCH_START.toString(), this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE.toString(), this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END.toString(), this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL.toString(), this.onTouchCancel, this);
    }

    /**
     * 触摸点限制在触摸区域内
     * @param rect 区域
     * @param loc 触摸点
     */
    resetTouchPoint(rect: cc.Rect, loc: cc.Vec2): cc.Vec2 {
        if (!rect.contains(loc)) {
            if (loc.x < rect.x) loc.x = rect.x;
            else if (loc.x > rect.x + rect.width) loc.x = rect.x + rect.width;

            if (loc.y < rect.y) loc.y = rect.y;
            else if (loc.y > rect.y + rect.height) loc.y = rect.y + rect.height;
        }
        return loc;
    }

    onTouchStart(eventTouch: cc.Touch) {
        let loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());

        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
    }

    onTouchMove(eventTouch: cc.Touch) {
        let loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        let rect = this.node.getBoundingBox();

        let pos = this.node.convertToWorldSpace(cc.v2(0, 0));
        let origin = this.node.convertToNodeSpaceAR(pos);
        rect.x = origin.x;
        rect.y = origin.y;

        //设置边界
        if (!rect.contains(loc)) {
            loc = this.resetTouchPoint(rect, loc);
        }

        let previousLocation = this.resetTouchPoint(rect, this.node.convertToNodeSpaceAR(eventTouch.getPreviousLocation()));
        this.graphics.moveTo(previousLocation.x, previousLocation.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
    }

    onTouchEnd(eventTouch: cc.Touch) {
        let loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
        //触摸结束后调用
        this.onFinishDraw();
    }

    onTouchCancel(eventTouch: cc.Touch) {
        let loc = this.node.convertToNodeSpaceAR(eventTouch.getLocation());
        this.graphics.moveTo(loc.x, loc.y);
        this.graphics.lineTo(loc.x, loc.y);
        this.graphics.stroke();
        //触摸结束后调用
        this.onFinishDraw();
    }
}