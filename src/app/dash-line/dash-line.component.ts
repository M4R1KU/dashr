import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DashModel} from '../model/dash-model';
import {isNotNullOrUndefined} from '../util/helper';

@Component({
    selector: 'dashr-dash-line',
    templateUrl: './dash-line.component.html',
    styleUrls: ['./dash-line.component.scss']
})
export class DashLineComponent implements OnChanges {
    @Input() dashChildren: Array<DashModel>;
    @Output() dashChange: EventEmitter<string> = new EventEmitter();

    @Input() path: string;
    public childPath: string;
    @Input() public pathSnapshot: string;

    public activeChild: DashModel;

    constructor() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ((changes.hasOwnProperty('path') && isNotNullOrUndefined(this.dashChildren)) ||
            changes.hasOwnProperty('dashChildren')) {
            this._handlePathChange();
        }
    }

    public activateChild(dash: DashModel) {
        this.dashChange.emit(`/${dash.shortcut}`);
    }

    private _handlePathChange() {
        if (isNotNullOrUndefined(this.path)) {
            const match = this.path.match(/[a-z]+/);
            if (isNotNullOrUndefined(match)) {
                this.pathSnapshot = match[0];
                this.childPath = this.path.replace(this.pathSnapshot, '').replace(/[\/]{2,}/, '/');

                if (this.dashChildren) {
                    this.activeChild = this.dashChildren.find(child => child.shortcut === this.pathSnapshot);
                }
            } else {
                this.activeChild = null;
            }
        }
    }
}
