import DrawNode from "./draw_node";
import PixelUtil from "./utils/PixelUtil";

const {
    ccclass,
    property
} = cc._decorator;

const modelUrl = 'http://127.0.0.1:8080/tensorflow_model/model.json';
let tensorflow_model = null;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    draw_node: cc.Node = null;

    @property(cc.Label)
    resutlt_label: cc.Label = null;

    drawNodeScr: DrawNode = null;

    onLoad() {
        this.drawNodeScr = this.draw_node.getComponent('draw_node') as DrawNode;

        async function load() {
            tensorflow_model = await tf.loadLayersModel(modelUrl);
        }
        load();
    }

    runTensorflow() {
        if (tensorflow_model == null) {
            cc.error('tensorflow_model is null !');
            return;
        }
        let drawNodeScr = this.drawNodeScr;
        let pixelsData = drawNodeScr.getPixelsData();
        let pixels = PixelUtil.convertToUint8ClampedArray(pixelsData);
        let imgData = new ImageData(pixels, 28, 28);
        let img = tf.browser.fromPixels(imgData, 1);
        img = img.reshape([1, 28, 28, 1]);
        img = tf.cast(img, 'float32');

        let predict = tensorflow_model.predict(img);
        let predictions = Array.from(predict.dataSync());
        let maxProb = 0;
        let number;
        predictions.forEach((prob, num) => {
            if (prob > maxProb) {
                maxProb = prob as number;
                number = num;
            }
        });
        this.resutlt_label.string = number;
    }
}