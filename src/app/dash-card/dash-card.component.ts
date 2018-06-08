import {AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DashModel} from '../model/dash-model';
import {Subject} from 'rxjs';
import * as queryString from 'querystring';

@Component({
    selector: 'dashr-dash-card',
    templateUrl: './dash-card.component.html',
    styleUrls: ['./dash-card.component.scss']
})
export class DashCardComponent implements OnInit, AfterViewChecked {
    @Input() dashModel: DashModel;
    @Output() activate: EventEmitter<any> = new EventEmitter();
    @ViewChild('link') public link: ElementRef;

    private _click$: Subject<DashModel> = new Subject();

    ngOnInit() {
        this._click$.subscribe(model => this.activate.emit(model));
    }

    ngAfterViewChecked(): void {
        if (this.dashModel.url) {
            const params = queryString.parse(location.search.replace('?', ''));
            if (params.mode && params.mode === 'redirect') {
                this.link.nativeElement.click();
            }
        }
    }

    @HostListener('click')
    private _onClick() {
        this._click$.next(this.dashModel);
    }
}
