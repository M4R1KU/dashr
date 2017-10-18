import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DashrMaterialModule} from './dashr-material.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DashLineComponent} from './dash-line/dash-line.component';
import {DashCardComponent} from './dash-card/dash-card.component';
import {DashConfigParserService} from './parser/dash-config-parser.service';
import {ConfigService} from './service/config.service';
import * as Ajv from 'ajv';
import {AJV} from './service/ajv-injection-token';
import {HttpClientModule} from '@angular/common/http';
import {ajvProvider} from './service/factories';

@NgModule({
    declarations: [
        AppComponent,
        DashLineComponent,
        DashCardComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        DashrMaterialModule
    ],
    providers: [
        DashConfigParserService,
        ConfigService,
        {
            provide: AJV,
            useFactory: ajvProvider
        }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
