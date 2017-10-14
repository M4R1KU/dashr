import {DashModel} from '../model/dash-model';
import {isEmpty, isNullOrUndefined} from '../util/helper';
import {ConfigModel} from '../model/config-model';
import {Injectable} from '@angular/core';

@Injectable()
export class DashConfigParser {
    private readonly COMMON_TYPE_INDICATOR = 'common#';

    public parseModel(source: ConfigModel): Array<DashModel> {
        return source.apps.map(element => {
            if (!isEmpty(element.children)) {
                element.children = element.children.map(child => this.parseChildWithUrl(child, element.urlTemplate, source.common));
            } else {
                element.url = element.urlTemplate;
            }
            this.useTitleAsShortCutIfMissing(element);
            delete element.urlTemplate;
            return element;
        });
    }

    private parseChildWithUrl(child: any, urlTemplate: string, commonTypes: any): DashModel {
        if (!isNullOrUndefined(child.urlParts)) {
            Object.keys(child.urlParts)
                .forEach(key => urlTemplate = this.interpolateUrl(urlTemplate, key, child.urlParts[key]));
            delete child.urlParts;
        }

        if (!isEmpty(child.children)) {
            child.children = child.children.map(c =>
                this.parseChildWithUrl(this.useModelOrCommonModel(c, commonTypes), urlTemplate, commonTypes)
            );
        } else {
            child.url = this.cleanUrlFromBraces(urlTemplate);
        }
        this.useTitleAsShortCutIfMissing(child);

        return child;
    }

    private useModelOrCommonModel(model: string | object, commonTypes: any) {
        if (typeof model === 'string' && model.startsWith(this.COMMON_TYPE_INDICATOR)) {
            return JSON.parse(JSON.stringify(commonTypes[model.replace(this.COMMON_TYPE_INDICATOR, '')]));
        } else if (typeof model === 'object') {
            return model;
        } else {
            throw new Error(model + ' is neither applicable to a commonType nor a special type');
        }
    }

    private useTitleAsShortCutIfMissing(model: any) {
        if (isNullOrUndefined(model.shortcut)) {
            model.shortcut = model.title.toLowerCase();
        }
    }

    private interpolateUrl(url: string, key: string, val: string): string {
        return url.replace(`{${key}}`, val);
    }

    private cleanUrlFromBraces(url: string) {
        return url.replace(RegExp('\{[a-zA-z0-9]+\}'), '');
    }
}
