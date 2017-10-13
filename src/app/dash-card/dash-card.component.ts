import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {DashModel} from '../model/dash-model';
import {Observable} from 'rxjs/Observable';
import {isNullOrUndefined} from '../util/helper';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'dashr-dash-card',
    templateUrl: './dash-card.component.html',
    styleUrls: ['./dash-card.component.scss']
})
export class DashCardComponent implements OnInit {
    @Input() dashModel: DashModel;
    @Output() activate: EventEmitter<any> = new EventEmitter();
    @ViewChild('link') public link: ElementRef;

    private _click$: Subject<DashModel> = new Subject();

    ngOnInit() {
        this._click$.subscribe(model => this.activate.emit(model));
    }

    @HostListener('click')
    private _onClick() {
        this._click$.next(this.dashModel);
    }
}
