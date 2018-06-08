import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DashModel} from './model/dash-model';
import {BehaviorSubject, Subject} from 'rxjs';
import {ConfigService} from './service/config.service';
import {Profile} from './model/profile';
import {ConfigModel} from './model/config-model';

@Component({
    selector: 'dashr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    public config$: Subject<Array<DashModel>> = new Subject();
    public profile$: Subject<Profile> = new Subject();
    public profiles$: Subject<Array<Profile>> = new BehaviorSubject([]);
    public path$: Subject<string> = new BehaviorSubject(location.pathname);

    @ViewChild('clipboardHelper') private _clipboardHelper: ElementRef;

    constructor(private _configService: ConfigService) {
    }

    ngOnInit(): void {
        this._configService.loadConfig()
            .subscribe(configModel => this._initProfileAndModel(configModel));
    }

    ngOnDestroy(): void {
        this.profile$.complete();
        this.profiles$.complete();
        this.config$.complete();
        this.path$.complete();
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

    private _initProfileAndModel(config: ConfigModel) {
        if (config.profiles) {
            this.profiles$.next(config.profiles);
            this.profile$.subscribe(profile => this.config$.next(this._configService.switchProfile(profile.id)));
        } else {
            this.config$.next(this._configService.parse(config));
        }
    }
}
