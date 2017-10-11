import {Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';
import * as Ajv from 'ajv';
import {ValidateFunction} from 'ajv';
import {parseModel} from './parser/dash-config-parser';
import {DashModel} from './dash-model';
import {Subject} from 'rxjs/Subject';
import {extractResponse} from './util/helper';

@Component({
    selector: 'dashr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public config$: Subject<Array<DashModel>> = new Subject();

    constructor(private _http: Http) {
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
            .do(console.log)
            .subscribe((result: any) => this._handleConfigLoad(result, ajv));
    }

    private _handleConfigLoad(config: { parseResult: boolean, data: any[] }, ajv: any) {
        if (!config.parseResult) {
            console.error('failed to load config');
            console.log(ajv.errorsText());
            return;
        }
        this.config$.next(parseModel(config.data));
    }
}
