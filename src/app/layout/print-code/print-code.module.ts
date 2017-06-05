import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { PrintCodeRoutingModule } from './print-code-routing.module';
import { PrintCodeComponent } from './print-code.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        PrintCodeRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
    ],
    declarations: [PrintCodeComponent]
})
export class PrintCodeModule { }
