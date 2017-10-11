import {NgModule} from '@angular/core';
import {MatCardModule, MatIconModule, MatToolbarModule} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        MatCardModule,
        MatIconModule
    ],
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatIconModule
    ]
})
export class DashrMaterialModule {
}
