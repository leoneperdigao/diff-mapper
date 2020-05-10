export enum ValueDiffType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  UNCHANGED = 'UNCHANGED',
}

export interface DiffMapResult {
  type: ValueDiffType;
  currentValue: any;
  newValue: any;
}

export default class DiffMapper {
  /**
   * @summary Maps the differences between two objects
   * @param source
   * @param target
   * @returns a map whit the UNCHANGED, CREATED, DELETED and UPDATED attributes
   * @throws an error if a non-object is given
   */
  public static map(source: any, target: any): DiffMapResult {
    const result: any = {};
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

  private static compareValues(actual: any, changed: any): ValueDiffType {
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

  private static isFunction(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }

  private static isArray(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Array]';
  }

  private static isObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  private static isValue(obj: any): boolean {
    return !this.isObject(obj) && !this.isArray(obj);
  }

  private static isDate(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Date]';
  }
}
