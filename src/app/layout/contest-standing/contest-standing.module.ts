import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContestStandingComponent } from './contest-standing.component';
import { ContestStandingRoutingModule } from './contest-standing-routing.module';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        ContestStandingRoutingModule,
        PageHeaderModule
    ],
    declarations: [ContestStandingComponent]
})
export class ContestStandingModule { }
