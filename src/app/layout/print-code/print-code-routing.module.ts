import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrintCodeComponent } from './print-code.component';

const routes: Routes = [
    { path: '', component: PrintCodeComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrintCodeRoutingModule { }
