import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { UserManageComponent } from './user-manage.component';
import { UserManageRoutingModule } from './user-manage-routing.module';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule,
        UserManageRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
    ],
    declarations: [UserManageComponent]
})
export class UserManageModule { }
