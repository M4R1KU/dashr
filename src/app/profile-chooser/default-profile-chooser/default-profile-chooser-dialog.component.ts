import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Profile} from '../../model/profile';

@Component({
    selector: 'dashr-default-profile-chooser-dialog',
    templateUrl: './default-profile-chooser-dialog.component.html'
})
export class DefaultProfileChooserDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) private _data: { profiles: Array<Profile> },
                private _dialogRef: MatDialogRef<DefaultProfileChooserDialogComponent>) {
    }

    public selectProfile(profile: Profile) {
        this._dialogRef.close(profile);
    }

    public get profiles() {
        return this._data.profiles;
    }
}
