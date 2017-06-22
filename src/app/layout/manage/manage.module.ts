import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ManageComponent } from './manage.component';
import { ManageRoutingModule } from './manage-routing.module';
import { PageHeaderModule } from '../../shared';
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
                if (typeof user[attr] != 'string') {
                    continue;
                }
                ok = ok || user[attr].toLowerCase().indexOf(query.toLowerCase()) > -1;
            }
            return ok;
        })
    }
}

@NgModule({
    imports: [
        CommonModule,
        ManageRoutingModule,
        PageHeaderModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
    ],
    declarations: [
        ManageComponent,
        UserManageFilterPipe,
    ]
})
export class ManageModule { }
