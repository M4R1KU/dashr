import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import * as Ajv from 'ajv';
import {DashConfigParser} from './parser/dash-config-parser.service';
import {DashModel} from './model/dash-model';
import {Subject} from 'rxjs/Subject';
import {extractResponse} from './util/helper';
import {ConfigModel} from './model/config-model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'dashr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public config$: Subject<Array<DashModel>> = new Subject();
    public path$: Subject<string> = new BehaviorSubject(window.location.pathname);

    constructor(private _http: Http,
                private _dashConfigParser: DashConfigParser) {
    }

    ngOnInit(): void {
        const ajv = new Ajv({allErrors: true});

        this._http.get('/assets/config-schema.json')
            .map(extractResponse)
            .switchMap(schema => this._http.get('/assets/config.json')
                .map(extractResponse)
                .map(data => {
                    return {
                        parseResult: ajv.validate(schema, data),
                        data: data
                    };
                })
            )
            .subscribe((result: any) => this._handleConfigLoad(result, ajv));
    }

    dashChange(path: string) {
        window.history.pushState('', '', path);
        this.path$.next(path);
    }

    private _handleConfigLoad(config: { parseResult: boolean, data: ConfigModel }, ajv: any) {
        if (!config.parseResult) {
            console.error('failed to load config');
            console.log(ajv.errorsText());
            return;
        }
        this.config$.next(this._dashConfigParser.parseModel(config.data));
    }
}
