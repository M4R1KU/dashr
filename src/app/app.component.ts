import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as Ajv from 'ajv';
import {DashConfigParserService} from './parser/dash-config-parser.service';
import {DashModel} from './model/dash-model';
import {Subject} from 'rxjs/Subject';
import {extractResponse, isNullOrUndefined} from './util/helper';
import {ConfigModel} from './model/config-model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Profile} from './model/profile';
import {ConfigService} from './service/config.service';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'dashr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public config$: Subject<Array<DashModel>> = new Subject();
    public path$: Subject<string> = new BehaviorSubject(location.pathname);
    @ViewChild('clipboardHelper') private _clipboardHelper: ElementRef;

    constructor(private _configService: ConfigService) {
    }

    ngOnInit(): void {
        this._configService.loadConfig()
            .subscribe(dashModel => this.config$.next(dashModel));
    }

    public dashChange(path: string) {
        history.pushState('', '', path);
        this.path$.next(path);
    }

    public copyCurrentPath() {
        try {
            this._clipboardHelper.nativeElement.value = location.href + '?mode=redirect';
            this._clipboardHelper.nativeElement.select();
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        }
    }
}
