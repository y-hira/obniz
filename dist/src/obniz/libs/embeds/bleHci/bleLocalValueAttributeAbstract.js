"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bleLocalAttributeAbstract_1 = __importDefault(require("./bleLocalAttributeAbstract"));
/**
 * @category Use as Peripheral
 */
class BleLocalValueAttributeAbstract extends bleLocalAttributeAbstract_1.default {
    constructor(params) {
        super(params);
    }
    /**
     * @ignore
     * @param dataArray
     */
    write(dataArray) {
        this.writeWait(dataArray); // background
    }
    /**
     * @ignore
     * @param dataArray
     */
    read() {
        this.readWait(); // background
    }
    /**
     * This writes dataArray.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * await attr.writeWait([0xf0,0x27]);
     * console.log("write success");
     * ```
     *
     * @param data
     */
    async writeWait(data) {
        this.data = data;
        this.notifyFromServer("onwrite", { result: "success" });
        return true;
    }
    /**
     * It reads data.
     *
     * Even you wrote string or number, it returns binary array.
     * It throws an error when failed.
     *
     * ```javascript
     * // Javascript Example
     * let data =  await attr.readWait()
     *  console.log("data: " , data );
     * ```
     */
    async readWait() {
        this.notifyFromServer("onread", { data: this.data });
        return this.data;
    }
    /**
     * @ignore
     * @param notifyName
     * @param params
     */
    notifyFromServer(notifyName, params) {
        super.notifyFromServer(notifyName, params);
        this.emitter.emit(notifyName, params);
        switch (notifyName) {
            case "onwritefromremote": {
                if (this.onwritefromremote) {
                    this.onwritefromremote(params.address, params.data);
                }
                break;
            }
            case "onreadfromremote": {
                if (this.onreadfromremote) {
                    this.onreadfromremote(params.address);
                }
                break;
            }
        }
    }
}
exports.default = BleLocalValueAttributeAbstract;

//# sourceMappingURL=bleLocalValueAttributeAbstract.js.map
