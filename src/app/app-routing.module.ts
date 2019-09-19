import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: '',
    loadChildren: './pages/tabs/tabs.module#TabsPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'classes',
    loadChildren: './pages/classes/classes.module#ClassesPageModule'
  },
  {
    path: 'students',
    loadChildren: './pages/students/students.module#StudentsPageModule'
  },
  {
    path: 'activities',
    loadChildren: './pages/activities/activities.module#ActivitiesPageModule'
  },
  {
    path: 'grades',
    loadChildren: './pages/grades/grades.module#GradesPageModule'
  },
  {
    path: 'library',
    loadChildren: './pages/library/library.module#LibraryPageModule'
  },
  {
    path: 'reports',
    loadChildren: './pages/reports/reports.module#ReportsPageModule'
  },
  {
    path: 'records',
    loadChildren: './pages/records/records.module#RecordsPageModule'
  },
  {
    path: 'create-exams',
    loadChildren:
      './pages/create-exams/create-exams.module#CreateExamsPageModule'
  },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterPageModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
