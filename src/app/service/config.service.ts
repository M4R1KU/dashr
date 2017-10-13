import {Inject, Injectable} from '@angular/core';
import {Ajv, ValidateFunction} from 'ajv';
import {AJV} from './ajv-injection-token';
import {extractResponse, isEmpty, isNullOrUndefined} from '../util/helper';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {ConfigModel} from '../model/config-model';
import {Profile} from '../model/profile';
import {DashModel} from '../model/dash-model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import {DashConfigParserService} from '../parser/dash-config-parser.service';

@Injectable()
export class ConfigService {
    private _config: ConfigModel;
    private _profiles: Array<Profile>;
    private _dashModel: Array<DashModel>;

    private _schema$: ReplaySubject<any> = ReplaySubject.create(null,
        this._http.get('/assets/config-schema.json'));

    constructor(private _http: HttpClient,
                private _dashConfigParserService: DashConfigParserService,
                @Inject(AJV) private _ajv: Ajv) {
        this._schema$.subscribe(this._init.bind(this));
    }

    public loadConfig(): Observable<Array<DashModel>> {
        return this._http.get<ConfigModel>(environment.configPath)
            .switchMap(config => this._validate(config))
            .do(config => this._saveConfig(config))
            .map(config => this.parse(config));
    }

    public switchProfile(profileId: string): Array<DashModel> {
        if (isNullOrUndefined(this._config)) {
            throw new Error('No config is loaded');
        }
        return this.parse(this._config, profileId);
    }

    public parse(config: ConfigModel = this._config, profileId: string = this.getProfileByIdOrDefault().id): Array<DashModel> {
        return this._dashConfigParserService.parseModel(config, profileId);
    }

    public getProfileByIdOrDefault(profileId: string = ''): Profile {
        if (isNullOrUndefined(this._profiles) || isEmpty(this._profiles)) {
            return null;
        }

        if (isEmpty(profileId)) {
            return this.getDefaultProfile();
        }

        return this._profiles.find(profile => profile.id === profileId) || this.getDefaultProfile();
    }

    public getDefaultProfile(): Profile {
        return (JSON.parse(localStorage.getItem('profile')) as Profile) || this._profiles[0];
    }

    public saveDefaultProfile(profile: Profile) {
        localStorage.setItem('profile', JSON.stringify(profile));
    }

    private _init(schema: any) {
        this._ajv.addSchema(schema, 'config-schema');
    }

    private _validate(config): Observable<ConfigModel> {
        const validationResult = this._ajv.validate('config-schema', config);
        if (validationResult === true) {
            return Observable.of(config);
        }
        return Observable.throw(this._ajv.errorsText());
    }

    private _saveConfig(config: ConfigModel) {
        this._config = config;
        this._profiles = config.profiles;
    }

    public get config(): ConfigModel {
        return this._config;
    }

    public get profiles(): Array<Profile> {
        return this._profiles;
    }

    public get dashModel(): Array<DashModel> {
        return this._dashModel;
    }
}
