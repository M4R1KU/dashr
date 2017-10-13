import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DashrMaterialModule} from './dashr-material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import {DashLineComponent} from './dash-line/dash-line.component';
import {DashCardComponent} from './dash-card/dash-card.component';
import {DashConfigParser} from './parser/dash-config-parser.service';
import {RouterModule} from '@angular/router';

@NgModule({
    declarations: [
        AppComponent,
        DashLineComponent,
        DashCardComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        DashrMaterialModule
    ],
    providers: [
        DashConfigParser
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
