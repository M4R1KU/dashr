import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog, MatSelectChange} from '@angular/material';
import {Profile} from '../model/profile';
import {ConfigService} from '../service/config.service';
import {DefaultProfileChooserDialogComponent} from './default-profile-chooser/default-profile-chooser-dialog.component';
import {profileComparator} from '../service/comparator';
import {isEmpty, isNotNullOrUndefined, isNullOrUndefined} from '../util/helper';
import {Subject} from 'rxjs';
import {filter, map, startWith, tap} from 'rxjs/internal/operators';

@Component({
    selector: 'dashr-profile-chooser',
    templateUrl: './profile-chooser.component.html',
    styleUrls: ['./profile-chooser.component.scss']
})
export class ProfileChooserComponent implements OnInit, OnChanges {
    @Input() profiles: Array<Profile>;
    @Output() profileChange: EventEmitter<Profile> = new EventEmitter();

    public selectChange$: Subject<MatSelectChange> = new Subject();

    public currentProfile: Profile;

    constructor(private _dialog: MatDialog,
                private _configService: ConfigService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const profiles = changes['profiles'];
        if (isNullOrUndefined(profiles) || isEmpty(profiles.currentValue as Array<Profile>)) {
            return;
        }
        const currentProfile = this._configService.getCurrentProfile();
        if (currentProfile && this.currentProfile !== currentProfile) {
            this.currentProfile = currentProfile;
            this.profileChange.emit(this.currentProfile);
        } else {
            this._openDefaultProfileChooser();
        }
    }

    ngOnInit() {
        this.selectChange$
            .pipe(map((selectChange: MatSelectChange) => selectChange.value as Profile))
            .subscribe(profile => this.profileChange.emit(profile));
    }

    public selectComparator(optionValue: Profile, selectionValue: Profile) {
        return profileComparator(optionValue, selectionValue);
    }

    private _openDefaultProfileChooser() {
        // needed until https://github.com/angular/angular/pull/18352 is in a release
        Promise.resolve(null).then(() =>
            this._dialog.open(DefaultProfileChooserDialogComponent, {
                data: {
                    profiles: this._configService.profiles
                }
            })
                .afterClosed()
                .pipe(
                    filter(result => isNotNullOrUndefined(result)),
                    startWith(this._configService.getDefaultProfile())
                )
                .subscribe(result => {
                    this.currentProfile = result;
                    this.profileChange.emit(this.currentProfile);
                    this._configService.saveDefaultProfile(this.currentProfile);
                })
        );
    }
}
