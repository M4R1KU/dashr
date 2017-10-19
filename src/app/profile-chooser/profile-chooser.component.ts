import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatSelectChange} from '@angular/material';
import {Profile} from '../model/profile';
import {Subject} from 'rxjs/Subject';
import {ConfigService} from '../service/config.service';
import {DefaultProfileChooserDialogComponent} from './default-profile-chooser/default-profile-chooser-dialog.component';
import {profileComparator} from '../service/comparator';

@Component({
    selector: 'dashr-profile-chooser',
    templateUrl: './profile-chooser.component.html',
    styleUrls: ['./profile-chooser.component.scss']
})
export class ProfileChooserComponent implements OnInit {
    @Input() profiles: Array<Profile>;
    @Output() profileChange: EventEmitter<Profile> = new EventEmitter();

    public selectChange$: Subject<MatSelectChange> = new Subject();

    public currentProfile: Profile;

    constructor(private _dialog: MatDialog,
                private _configService: ConfigService) {
    }

    ngOnInit() {
        const currentProfile = this._configService.getCurrentProfile();
        if (currentProfile) {
            this.currentProfile = currentProfile;
            this.profileChange.emit(this.currentProfile);
        } else {
            // needed until https://github.com/angular/angular/pull/18352 is in a release
            Promise.resolve(null).then(() =>
                this._dialog.open(DefaultProfileChooserDialogComponent, {
                    data: {
                        profiles: this._configService.profiles
                    }
                }).afterClosed()
                    .subscribe(result => {
                        if (!result) {
                            result = this._configService.getDefaultProfile();
                        }
                        this.currentProfile = result;
                        this.profileChange.emit(this.currentProfile);
                        this._configService.saveDefaultProfile(this.currentProfile);
                    })
            );
        }

        this.selectChange$.map(selectChange => selectChange.value as Profile)
            .subscribe(profile => this.profileChange.emit(profile));
    }

    public selectComparator(optionValue: Profile, selectionValue: Profile) {
        return profileComparator(optionValue, selectionValue);
    }

}
