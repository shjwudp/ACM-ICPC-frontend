import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';


import { UserManageComponent, NgbdModalContent } from './user-manage.component';
import { UserManageRoutingModule } from './user-manage-routing.module';
import { PageHeaderModule } from './../../shared';
import { UserInterface } from '../../models';

@Pipe({
    name: 'UserManageFilterPipe',
    pure: false
})
export class UserManageFilterPipe implements PipeTransform {
    transform(users: Array<UserInterface>, query: string): Array<UserInterface> {
        return users.filter(user => {
            let ok: boolean = (query == "");
            let forbid: Array<string> = ["Password", "TeamKey"];
            for (var attr in user) {
                if (forbid.indexOf(attr) > -1) {
                    continue;
                }
                // console.log(attr, user[attr])
                ok = ok || user[attr].toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
            return ok;
        })
    }
}

@NgModule({
    imports: [
        CommonModule,
        UserManageRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        FormsModule,
    ],
    declarations: [
        UserManageComponent,
        UserManageFilterPipe,
        NgbdModalContent,
    ],
    entryComponents: [NgbdModalContent]
})
export class UserManageModule { }
