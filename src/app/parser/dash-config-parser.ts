import {DashModel} from '../dash-model';
import {isEmpty, isNullOrUndefined} from '../util/helper';

export function parseModel(source: any[]): Array<DashModel> {
    return source.map(element => {
        if (!isEmpty(element.children)) {
            element.children = element.children.map(child => parseChildWithUrl(child, element.urlTemplate));
        } else {
            element.url = element.urlTemplate;
        }
        delete element.urlTemplate;
        return element;
    });
}

function parseChildWithUrl(child: any, urlTemplate: string): DashModel {
    if (!isNullOrUndefined(child.urlParts)) {
        Object.keys(child.urlParts)
            .forEach(key => urlTemplate = interpolateUrl(urlTemplate, key, child.urlParts[key]));
        delete child.urlParts;
    }

    if (!isEmpty(child.children)) {
        child.children = child.children.map(c => parseChildWithUrl(c, urlTemplate));
    } else {
        child.url = cleanUrlFromBraces(urlTemplate);
    }
    return child;
}

function interpolateUrl(url: string, key: string, val: string): string {
    return url.replace(`{${key}}`, val);
}

function cleanUrlFromBraces(url: string) {
    return url.replace(RegExp('\{[a-zA-z0-9]+\}'), '');
}
