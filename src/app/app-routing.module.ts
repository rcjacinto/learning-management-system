import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

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
  { path: '', loadChildren: './pages/tabs/tabs.module#TabsPageModule' },
  { path: 'classes', loadChildren: './pages/classes/classes.module#ClassesPageModule' },
  { path: 'students', loadChildren: './pages/students/students.module#StudentsPageModule' },
  { path: 'activities', loadChildren: './pages/activities/activities.module#ActivitiesPageModule' },
  { path: 'grades', loadChildren: './pages/grades/grades.module#GradesPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
