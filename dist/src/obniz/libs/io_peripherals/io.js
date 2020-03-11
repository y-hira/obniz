"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * General purpose IO
 * This is available on each io (for obniz Board series, it's io0 to io11)
 * @category Peripherals
 */
class PeripheralIO {
    constructor(obniz, id) {
        this.Obniz = obniz;
        this.id = id;
        this._reset();
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        this.value = false;
        this.observers = [];
    }
    /**
     * Make ioX to output mode and put out 1 or 0.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io1.output(true); // io1 is 5v
     * obniz.io2.output(1); //  io2 is 5v
     * obniz.io3.drive("3v");
     * obniz.io3.output(1); // io3 is around 3v.
     * ```
     *
     * @param value output value
     */
    output(value) {
        value = !!value;
        const obj = {};
        obj["io" + this.id] = value;
        this.value = value;
        this.Obniz.send(obj);
    }
    /**
     * This allows you to change output drive method.
     * By default, it is set as push-pull 5v.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io0.output(true); // output push-pull 5v
     *
     * obniz.io1.drive("3v");
     * obniz.io1.output(true); // output push-pull 3v
     *
     * obniz.io2.pull("5v");
     * obniz.io2.drive("open-drain");
     * obniz.io2.output(true); // output open-drain with 5v pull-up
     * ```
     *
     * @param drive
     *
     */
    drive(drive) {
        if (typeof drive !== "string") {
            throw new Error("please specify drive methods in string");
        }
        let output_type = "";
        switch (drive) {
            case "5v":
                output_type = "push-pull5v";
                break;
            case "3v":
                output_type = "push-pull3v";
                break;
            case "open-drain":
                output_type = "open-drain";
                break;
            default:
                throw new Error("unknown drive method");
        }
        const obj = {};
        obj["io" + this.id] = {
            output_type,
        };
        this.Obniz.send(obj);
    }
    /**
     * This enables/disables internal weak pull up/down resistors.
     *
     * ```javascript
     * // Javascript Example
     * obniz.io0.pull("3v");
     * obniz.io0.drive("open-drain"); // output open-drain
     * obniz.io0.output(false);
     * ```
     *
     * @param updown
     *
     */
    pull(updown) {
        if (typeof updown !== "string" && updown !== null) {
            throw new Error("please specify pull methods in string");
        }
        let pull_type = "";
        switch (updown) {
            case "5v":
                pull_type = "pull-up5v";
                break;
            case "3v":
                pull_type = "pull-up3v";
                break;
            case "0v":
                pull_type = "pull-down";
                break;
            case null:
                pull_type = "float";
                break;
            default:
                throw new Error("unknown pull_type method");
        }
        const obj = {};
        obj["io" + this.id] = {
            pull_type,
        };
        this.Obniz.send(obj);
    }
    /**
     * Make ioX to input mode.
     * Callback function will be called when io changes its input value.
     *
     *
     * @param callback
     */
    input(callback) {
        this.onchange = callback;
        const obj = {};
        obj["io" + this.id] = {
            direction: "input",
            stream: true,
        };
        this.Obniz.send(obj);
        return this.value;
    }
    /**
     * Make ioX to input mode.
     *
     * And this will return the current input value.
     * It pauses the process until the value is returned.
     *
     * ```javascript
     * // Javascript Example
     * var value = await obniz.io0.inputWait();
     * console.log(value);
     * ```
     */
    inputWait() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.addObserver(resolve);
            const obj = {};
            obj["io" + self.id] = {
                direction: "input",
                stream: false,
            };
            self.Obniz.send(obj);
        });
    }
    /**
     * This ends output/input on ioX.
     *
     *
     * This function is effective only when using ioX.output() or ioX.input().
     * This won't be called when AD/UART/etc are used.
     * Pull-up down also will not affected.
     *
     * ```
     * // Javascript Example
     * obniz.io0.output(true)
     * obniz.io0.end();
     * ```
     *
     */
    end() {
        const obj = {};
        obj["io" + this.id] = null;
        this.Obniz.send(obj);
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        if (typeof obj === "boolean") {
            this.value = obj;
            const callback = this.observers.shift();
            if (callback) {
                callback(obj);
            }
            if (typeof this.onchange === "function") {
                this.onchange(obj);
            }
        }
        else if (obj && typeof obj === "object") {
            if (obj.warning) {
                this.Obniz.warning({
                    alert: "warning",
                    message: `io${this.id}: ${obj.warning.message}`,
                });
            }
            if (obj.error) {
                this.Obniz.error({
                    alert: "error",
                    message: `io${this.id}: ${obj.error.message}`,
                });
            }
        }
    }
    addObserver(callback) {
        if (callback) {
            this.observers.push(callback);
        }
    }
}
exports.default = PeripheralIO;
//# sourceMappingURL=io.js.map