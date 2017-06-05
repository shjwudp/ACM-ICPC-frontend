import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContestStandingComponent } from './contest-standing.component';

const routes: Routes = [
    { path: '', component: ContestStandingComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ContestStandingRoutingModule { }
