import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DashModel} from './model/dash-model';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {ConfigService} from './service/config.service';
import {Profile} from './model/profile';

@Component({
    selector: 'dashr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public config$: Subject<Array<DashModel>> = new Subject();
    public profile$: Subject<Profile> = new Subject();
    public path$: Subject<string> = new BehaviorSubject(location.pathname);
    @ViewChild('clipboardHelper') private _clipboardHelper: ElementRef;

    private _profiles: Array<Profile>;

    constructor(private _configService: ConfigService) {
    }

    ngOnInit(): void {
        this._configService.loadConfig()
            .subscribe(configModel => this._profiles = configModel.profiles);

        this.profile$.subscribe(profile => this.config$.next(this._configService.switchProfile(profile.id)));
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

    get profiles(): Array<Profile> {
        return this._profiles;
    }
}
