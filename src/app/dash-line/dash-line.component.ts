import {Component, Input, OnInit} from '@angular/core';
import {DashModel} from '../dash-model';
import {Subject} from 'rxjs/Subject';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
    selector: 'dashr-dash-line',
    templateUrl: './dash-line.component.html',
    styleUrls: ['./dash-line.component.scss']
})
export class DashLineComponent implements OnInit {
    @Input() dashChildren: Array<DashModel>;

    public activeChild$: Subject<DashModel> = new BehaviorSubject(null);

    constructor() {
    }

    ngOnInit() {
    }
}
