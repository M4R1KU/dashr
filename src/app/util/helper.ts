import {Response} from '@angular/http';

export function isNullOrUndefined(toCheck: any): boolean {
    return toCheck === null || toCheck === undefined;
}

export function isNotNullOrUndefined(toCheck: any): boolean {
    return !isNullOrUndefined(toCheck);
}

export function isEmpty(toCheck: Array<any> | string): boolean {
    return isNullOrUndefined(toCheck) || toCheck.length === 0;
}

export function extractResponse(response: Response): any  {
    return response.json();
}
