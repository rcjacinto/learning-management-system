import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardPageModule'
      },
      {
        path: 'classes',
        loadChildren: '../classes/classes.module#ClassesPageModule'
      },
      {
        path: 'activities',
        loadChildren: '../activities/activities.module#ActivitiesPageModule'
      },
      {
        path: 'students',
        loadChildren: '../students/students.module#StudentsPageModule'
      },
      {
        path: 'grades',
        loadChildren: '../grades/grades.module#GradesPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
