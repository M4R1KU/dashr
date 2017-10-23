export function isNullOrUndefined(toCheck: any): boolean {
    return toCheck === null || toCheck === undefined;
}

export function isNotNullOrUndefined(toCheck: any): boolean {
    return !isNullOrUndefined(toCheck);
}

export function isEmpty(toCheck: Array<any> | string): boolean {
    return isNullOrUndefined(toCheck) || toCheck.length === 0;
}

export function clone(obj: any): any {
    if (isNullOrUndefined(obj)) {
        return {};
    }
    return JSON.parse(JSON.stringify(obj));
}
