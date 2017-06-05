import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BallonStatusComponent } from './ballon-status.component';

const routes: Routes = [
    { path: '', component: BallonStatusComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BallonStatusRoutingModule { }
