import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BallonStatusComponent } from './ballon-status.component';
import { BallonStatusRoutingModule } from './ballon-status-routing.module';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        BallonStatusRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
    ],
    declarations: [BallonStatusComponent]
})
export class BallonStatusModule { }
