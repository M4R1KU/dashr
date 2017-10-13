import {NgModule} from '@angular/core';
import {MatButtonModule, MatCardModule, MatIconModule, MatToolbarModule} from '@angular/material';

@NgModule({
    imports: [
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [
        MatToolbarModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
    ]
})
export class DashrMaterialModule {
}
