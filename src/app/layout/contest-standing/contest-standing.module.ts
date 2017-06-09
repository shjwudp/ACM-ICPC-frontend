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
    transform(items: Array<any>, query: string): Array<any> {
        return items.filter(item => {
            return query == "" || item.TeamName.toLowerCase().indexOf(query.toLowerCase()) > -1;
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
