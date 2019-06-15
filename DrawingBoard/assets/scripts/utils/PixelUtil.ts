//目标图像尺寸
const judgeSize = new cc.Size(28, 28);

class PixelUtil {
    static judegSize = new cc.Size(28, 28);
    constructor() {

    }

    //翻转图像y轴
    filpYImage(data: Uint8Array, size: cc.Size): Uint8Array {
        let width = size.width;
        let height = size.height;
        let picData = new Uint8Array(width * height * 4);
        let idx = 0;
        for (let row = height - 1; row >= 0; --row) {
            for (let col = 0; col < width * 4; ++col) {
                picData[idx++] = data[row * width * 4 + col];
            }
        }
        return picData;
    }

    /**
     * 
     * @param pixelsData 像素数据
     * @param size 像素数据size
     */
    scalePixels(pixelsData: Uint8Array, size: cc.Size): Array < number > {
        let width = size.width;
        let height = size.height;

        let pixels = pixelsData;

        //像素缩放
        let scaleX = Math.floor(width / (judgeSize.width - 1));
        let scaleY = Math.floor(height / (judgeSize.height - 1));
        let outputData = [];

        for (let row = 0; row < judgeSize.height; ++row) {
            for (let col = 0; col < judgeSize.width; ++col) {
                let toRow = row * scaleY * width * 4;
                let toCol = col * scaleX * 4;
                outputData.push(pixels[toRow + toCol + 0]);
                outputData.push(pixels[toRow + toCol + 1]);
                outputData.push(pixels[toRow + toCol + 2]);
                outputData.push(pixels[toRow + toCol + 3]);
            }
        }
        return outputData;
    }

    /**
     * 转换到指定尺寸灰度图
     * @param pixelsData 像素数据
     * @param dataSize 像素数据size
     * @param targetSize 转换目标size
     */
    grayPixels(pixelsData: Uint8Array, dataSize: cc.Size, targetSize: cc.Size) {
        let width = dataSize.width;
        let height = dataSize.height;
        //灰度化
        let pixels = pixelsData;
        let grayData = [];
        for (let i = 0; i < pixels.length; i += 4) {
            let r = pixels[i];
            let g = pixels[i + 1];
            let b = pixels[i + 2];
            let gray = (r * 30 + g * 59 + b * 11) / 100;
            grayData.push(gray);
        }

        //缩放
        let scaleX = Math.floor(width / (targetSize.width - 1));
        let scaleY = Math.floor(height / (targetSize.height - 1));
        let outputData = [];

        for (let row = 0; row < targetSize.height; ++row) {
            for (let col = 0; col < judgeSize.width; ++col) {
                let toRow = row * scaleY * width;
                let toCol = col * scaleX;
                outputData.push(pixels[toRow + toCol]);
            }
        }
        return outputData;
    }

    /**
     * 将数组转为Uint8ClampedArray
     * @param data 数组
     */
    convertToUint8ClampedArray(data): Uint8ClampedArray {
        let u8carr = new Uint8ClampedArray(data.length);
        for (let i = 0; i < data.length; ++i) {
            u8carr[i] = data[i + 1];
        }
        return u8carr
    }
}

export default new PixelUtil();