import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { dashboardRoutes } from './dashboardRoutes.module';

export const childRoutes: Routes = [
  { path: '', component: DashboardComponent, children: dashboardRoutes },
];

@NgModule({
  declarations: [
  ],
  imports: [
    RouterModule.forChild(childRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutesModule { }
