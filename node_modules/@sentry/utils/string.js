"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var is_1 = require("./is");
/**
 * Encodes given object into url-friendly format
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function truncate(str, max) {
    if (max === void 0) { max = 0; }
    if (max === 0 || !is_1.isString(str)) {
        return str;
    }
    return str.length <= max ? str : str.substr(0, max) + "\u2026";
}
exports.truncate = truncate;
/**
 * This is basically just `trim_line` from
 * https://github.com/getsentry/sentry/blob/master/src/sentry/lang/javascript/processor.py#L67
 *
 * @param str An object that contains serializable values
 * @param max Maximum number of characters in truncated string
 * @returns string Encoded
 */
function snipLine(line, colno) {
    var newLine = line;
    var ll = newLine.length;
    if (ll <= 150) {
        return newLine;
    }
    if (colno > ll) {
        colno = ll; // tslint:disable-line:no-parameter-reassignment
    }
    var start = Math.max(colno - 60, 0);
    if (start < 5) {
        start = 0;
    }
    var end = Math.min(start + 140, ll);
    if (end > ll - 5) {
        end = ll;
    }
    if (end === ll) {
        start = Math.max(end - 140, 0);
    }
    newLine = newLine.slice(start, end);
    if (start > 0) {
        newLine = "'{snip} " + newLine;
    }
    if (end < ll) {
        newLine += ' {snip}';
    }
    return newLine;
}
exports.snipLine = snipLine;
/**
 * Join values in array
 * @param input array of values to be joined together
 * @param delimiter string to be placed in-between values
 * @returns Joined values
 */
function safeJoin(input, delimiter) {
    var e_1, _a;
    if (!Array.isArray(input)) {
        return '';
    }
    var output = [];
    try {
        for (var input_1 = __values(input), input_1_1 = input_1.next(); !input_1_1.done; input_1_1 = input_1.next()) {
            var value = input_1_1.value;
            try {
                output.push(String(value));
            }
            catch (e) {
                output.push('[value cannot be serialized]');
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (input_1_1 && !input_1_1.done && (_a = input_1.return)) _a.call(input_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return output.join(delimiter);
}
exports.safeJoin = safeJoin;
/**
 * Checks if given value is included in the target
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes#Polyfill
 * @param target source string
 * @param search string to be looked for
 * @returns An answer
 */
function includes(target, search) {
    if (search.length > target.length) {
        return false;
    }
    else {
        return target.indexOf(search) !== -1;
    }
}
exports.includes = includes;
//# sourceMappingURL=string.js.map