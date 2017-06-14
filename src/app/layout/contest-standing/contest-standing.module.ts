import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContestStandingComponent } from './contest-standing.component';
import { ContestStandingRoutingModule } from './contest-standing-routing.module';
import { PageHeaderModule } from './../../shared';


@Pipe({
    name: 'namefilter',
    pure: false
})
export class NameFilterPipe implements PipeTransform {
    transform(teamList: Array<any>, query: string): Array<any> {
        return teamList.filter(team => {
            let ok: boolean = (query == "");
            ["TeamName", "School", "NickName"].forEach(attr => {
                if (attr in team && typeof team[attr] === 'string') {
                    ok = ok || team[attr].toLowerCase().indexOf(query.toLowerCase()) > -1;
                }
            });
            ["Coach", "Player1", "Player2", "Player3"].forEach(attr => {
                if (attr in team && typeof team[attr] === 'string') {
                    ok = ok || team[attr] === query;
                }
            });
            return ok;
        })
    }
}

@NgModule({
    imports: [
        CommonModule,
        ContestStandingRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
    ],
    declarations: [
        ContestStandingComponent,
        NameFilterPipe,
    ]
})
export class ContestStandingModule { }
