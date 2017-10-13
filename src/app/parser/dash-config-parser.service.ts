import {DashModel} from '../model/dash-model';
import {isEmpty, isNullOrUndefined} from '../util/helper';
import {ConfigModel} from '../model/config-model';
import {Injectable} from '@angular/core';
import {Profile} from '../model/profile';

@Injectable()
export class DashConfigParserService {
    private readonly COMMON_TYPE_INDICATOR = 'common#';

    public getAvailableProfilesFromModel(source: ConfigModel): Array<Profile> {
        return (source.profiles || []) as Array<Profile>;
    }

    public parseModel(source: ConfigModel, profile: string = ''): Array<DashModel> {
        return source.apps
            .filter(app => this._matchProfile(app, profile))
            .map(element => {
                if (!isEmpty(element.children)) {
                    element.children = element.children.map(child => this._parseChildWithUrl(child, element.urlTemplate, source.common));
                } else {
                    element.url = element.urlTemplate;
                }
                this._useTitleAsShortCutIfMissing(element);
                delete element.urlTemplate;
                return element;
            });
    }

    private _matchProfile(app: any, profile: string) {
        return isEmpty(profile) || isNullOrUndefined(app.profile) || app.profile.toLowerCase() === profile.toLowerCase();
    }

    private _parseChildWithUrl(child: any, urlTemplate: string, commonTypes: any): DashModel {
        if (!isNullOrUndefined(child.urlParts)) {
            Object.keys(child.urlParts)
                .forEach(key => urlTemplate = this._interpolateUrl(urlTemplate, key, child.urlParts[key]));
            delete child.urlParts;
        }

        if (!isEmpty(child.children)) {
            child.children = child.children.map(c =>
                this._parseChildWithUrl(this._useModelOrCommonModel(c, commonTypes), urlTemplate, commonTypes)
            );
        } else {
            child.url = this._cleanUrlFromBraces(urlTemplate);
        }
        this._useTitleAsShortCutIfMissing(child);

        return child;
    }

    private _useModelOrCommonModel(model: string | object, commonTypes: any) {
        if (typeof model === 'string' && model.startsWith(this.COMMON_TYPE_INDICATOR)) {
            return JSON.parse(JSON.stringify(commonTypes[model.replace(this.COMMON_TYPE_INDICATOR, '')]));
        } else if (typeof model === 'object') {
            return model;
        } else {
            throw new Error(model + ' is neither applicable to a commonType nor a special type');
        }
    }

    private _useTitleAsShortCutIfMissing(model: any) {
        if (isNullOrUndefined(model.shortcut)) {
            model.shortcut = model.title.toLowerCase();
        }
    }

    private _interpolateUrl(url: string, key: string, val: string): string {
        return url.replace(`{${key}}`, val);
    }

    private _cleanUrlFromBraces(url: string) {
        return url.replace(RegExp('\{[a-zA-z0-9]+\}'), '');
    }
}
