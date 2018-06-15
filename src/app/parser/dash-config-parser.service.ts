import {DashModel} from '../model/dash-model';
import {clone, isEmpty, isNotNullOrUndefined, isNullOrUndefined} from '../util/helper';
import {ConfigModel} from '../model/config-model';
import {Injectable} from '@angular/core';

@Injectable()
export class DashConfigParserService {
    private readonly COMMON_TYPE_INDICATOR = 'common#';
    private readonly KEY_PLACEHOLDER_REGEX = RegExp('\{([a-zA-z0-9]+)\}');

    public parseModel(source: ConfigModel, profile: string = ''): Array<DashModel> {
        return clone(source).apps
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

    private _parseChildWithUrl(child: any, urlTemplate: string, commonTypes: any, treeUrlParts = {}): DashModel {
        if (!isNullOrUndefined(child.urlParts)) {
            treeUrlParts = Object.assign(treeUrlParts, child.urlParts);
        }

        if (!isEmpty(child.children)) {
            child.children = child.children.map(c =>
                this._parseChildWithUrl(this._useModelOrCommonModel(c, commonTypes), urlTemplate, commonTypes, treeUrlParts)
            );
        } else {
            treeUrlParts = this._resolveInternalPlaceholders(treeUrlParts);
            child.url = this._cleanUrlFromBraces(this._interpolateUrl(urlTemplate, treeUrlParts));
        }
        this._useTitleAsShortCutIfMissing(child);
        delete child.urlParts;

        return child;
    }

    private _useModelOrCommonModel(model: string | object, commonTypes: any) {
        if (typeof model === 'string' && model.startsWith(this.COMMON_TYPE_INDICATOR)) {
            return clone(commonTypes[model.replace(this.COMMON_TYPE_INDICATOR, '')]);
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

    private _interpolateUrl(urlTemplate: string, parts: { [key: string]: string }) {
        Object.entries(parts)
            .forEach(([key, value]) => urlTemplate = this._interpolateKey(urlTemplate, key, value));
        return urlTemplate;
    }

    private _interpolateKey(urlTemplate: string, key: string, val: string): string {
        return urlTemplate.replace(`{${key}}`, val);
    }

    private _cleanUrlFromBraces(url: string) {
        return url.replace(this.KEY_PLACEHOLDER_REGEX, '');
    }

    private _replaceBraces(toClean: string, key: string) {
        const match = toClean.match(this.KEY_PLACEHOLDER_REGEX);
        if (isNotNullOrUndefined(match[1])) {
            return match[1];
        }
        return key;
    }

    private _isKeyPlaceholder(key: string) {
        const match = key.match(this.KEY_PLACEHOLDER_REGEX);
        return isNotNullOrUndefined(match) && match.index === 0;
    }

    private _resolveInternalPlaceholders(treeUrlParts: { [key: string]: string }): { [key: string]: string } {
        const toReplace = Object.entries(treeUrlParts)
            .filter(([key, value]) => this._isKeyPlaceholder(value))
            .map(([key, value]) => [key, this._replaceBraces(value, value)]);

        toReplace.forEach(([key, value]) => {
            if (!treeUrlParts.hasOwnProperty(value)) {
                throw new Error(`Url Parts does not have property of name '${value}'. It must exist to be used as placeholder.`);
            }
            treeUrlParts[key] = treeUrlParts[value];
        });

        return treeUrlParts;
    }
}
