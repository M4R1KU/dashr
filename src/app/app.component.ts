import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashModel} from './model/dash-model';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ConfigService} from './service/config.service';

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
            .subscribe(configModel => {
                this.config$.next(this._configService.parse(configModel, 'home'));
            });
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
