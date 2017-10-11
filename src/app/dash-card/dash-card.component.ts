import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {DashModel} from '../dash-model';

@Component({
    selector: 'dashr-dash-card',
    templateUrl: './dash-card.component.html',
    styleUrls: ['./dash-card.component.scss']
})
export class DashCardComponent implements OnInit {
    @Input() dashModel: DashModel;
    @Output() activate: EventEmitter<any> = new EventEmitter();

    @HostListener('click')
    private _onClick() {
        this.activate.emit();
    }

    ngOnInit() {
        this.activate.skipWhile(() => this.dashModel.children.length === 0);
    }

}
