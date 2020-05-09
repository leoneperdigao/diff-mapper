"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ValueDiffType;
(function (ValueDiffType) {
    ValueDiffType["CREATED"] = "CREATED";
    ValueDiffType["UPDATED"] = "UPDATED";
    ValueDiffType["DELETED"] = "DELETED";
    ValueDiffType["UNCHANGED"] = "UNCHANGED";
})(ValueDiffType = exports.ValueDiffType || (exports.ValueDiffType = {}));
class DiffMapper {
    /**
     * @summary Maps the differences between two objects
     * @param source
     * @param target
     * @returns a map whit the UNCHANGED, CREATED, DELETED and UPDATED attributes
     * @throws an error if a non-object is given
     */
    static map(source, target) {
        const result = {};
        if (this.isFunction(source) || this.isFunction(target)) {
            throw Error('Invalid argument. Function given, object expected.');
        }
        if (this.isValue(source) || this.isValue(target)) {
            return {
                type: this.compareValues(source, target),
                currentValue: source,
                newValue: target,
            };
        }
        Object.entries(source).forEach(([key, value]) => {
            let newValue;
            if (target[key] !== undefined) {
                newValue = target[key];
            }
            result[key] = this.map(value, newValue);
        });
        Object.entries(target).forEach(([key, value]) => {
            if (result[key] !== undefined) {
                return;
            }
            result[key] = this.map(undefined, value);
        });
        return result;
    }
    static compareValues(actual, changed) {
        if (actual === changed) {
            return ValueDiffType.UNCHANGED;
        }
        if (this.isDate(actual) && this.isDate(changed) && actual.getTime() === changed.getTime()) {
            return ValueDiffType.UNCHANGED;
        }
        if (actual === undefined) {
            return ValueDiffType.CREATED;
        }
        if (changed === undefined) {
            return ValueDiffType.DELETED;
        }
        return ValueDiffType.UPDATED;
    }
    static isFunction(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }
    static isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
    static isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    static isValue(obj) {
        return !this.isObject(obj) && !this.isArray(obj);
    }
    static isDate(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }
}
exports.default = DiffMapper;
