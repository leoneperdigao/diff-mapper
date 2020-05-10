export declare enum ValueDiffType {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    DELETED = "DELETED",
    UNCHANGED = "UNCHANGED"
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
    static map(source: any, target: any): DiffMapResult;
    /**
     *
     * @param diff
     * @returns DiffMapResult represented as an array
     * @throws an error if no diff result is passed as parameter
     */
    static toArray(diff: DiffMapResult): [string, DiffMapResult][];
    /**
     *
     * @param diff
     * @returns DiffMapResult stringified
     * @throws an error if no diff result is passed as parameter
     */
    static toString(diff: DiffMapResult): string;
    private static compareValues;
    private static isFunction;
    private static isArray;
    private static isObject;
    private static isValue;
    private static isDate;
}
