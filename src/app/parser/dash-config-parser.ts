import {DashModel} from '../dash-model';
import {isEmpty, isNullOrUndefined} from '../util/helper';

const common_type_indicator = 'common#';

export function parseModel(source: {apps: any[], common: object}): Array<DashModel> {
    return source.apps.map(element => {
        if (!isEmpty(element.children)) {
            element.children = element.children.map(child => parseChildWithUrl(child, element.urlTemplate, source.common));
        } else {
            element.url = element.urlTemplate;
        }
        delete element.urlTemplate;
        return element;
    });
}

function parseChildWithUrl(child: any, urlTemplate: string, commonTypes: any): DashModel {
    if (!isNullOrUndefined(child.urlParts)) {
        Object.keys(child.urlParts)
            .forEach(key => urlTemplate = interpolateUrl(urlTemplate, key, child.urlParts[key]));
        delete child.urlParts;
    }

    if (!isEmpty(child.children)) {
        child.children = child.children.map(c => parseChildWithUrl(useModelOrCommonModel(c, commonTypes), urlTemplate, commonTypes));
    } else {
        child.url = cleanUrlFromBraces(urlTemplate);
    }
    return child;
}

function useModelOrCommonModel(model: string | object, commonTypes: any) {
    if (typeof model === 'string' && model.startsWith(common_type_indicator)) {
        return commonTypes[model.replace(common_type_indicator, '')];
    } else if (typeof model === 'object') {
        return model;
    } else {
        throw new Error(model + ' is neither applicable to a commonType nor a special type');
    }
}

function interpolateUrl(url: string, key: string, val: string): string {
    return url.replace(`{${key}}`, val);
}

function cleanUrlFromBraces(url: string) {
    return url.replace(RegExp('\{[a-zA-z0-9]+\}'), '');
}
