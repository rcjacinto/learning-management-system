import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./services/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "tabs",
    pathMatch: "full"
  },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "",
    loadChildren: "./pages/tabs/tabs.module#TabsPageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "classes",
    loadChildren: "./pages/classes/classes.module#ClassesPageModule"
  },
  {
    path: "students",
    loadChildren: "./pages/students/students.module#StudentsPageModule"
  },
  {
    path: "activities",
    loadChildren: "./pages/activities/activities.module#ActivitiesPageModule"
  },
  {
    path: "grades",
    loadChildren: "./pages/grades/grades.module#GradesPageModule"
  },
  {
    path: "library",
    loadChildren: "./pages/library/library.module#LibraryPageModule"
  },
  {
    path: "reports",
    loadChildren: "./pages/reports/reports.module#ReportsPageModule"
  },
  {
    path: "records",
    loadChildren: "./pages/records/records.module#RecordsPageModule"
  },
  {
    path: "create-exams",
    loadChildren:
      "./pages/create-exams/create-exams.module#CreateExamsPageModule"
  },
  {
    path: "login",
    loadChildren: "./pages/login/login.module#LoginPageModule"
  },
  {
    path: "register",
    loadChildren: "./pages/register/register.module#RegisterPageModule"
  },
  {
    path: "profile",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "about",
    loadChildren: "./pages/about/about.module#AboutPageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "student-dashboard",
    loadChildren:
      "./pages/student-dashboard/student-dashboard.module#StudentDashboardPageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "my-grades",
    loadChildren: "./pages/my-grades/my-grades.module#MyGradesPageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "my-activities",
    loadChildren:
      "./pages/my-activities/my-activities.module#MyActivitiesPageModule",
    canActivate: [AuthGuard]
  },
  {
    path: "take-exams",
    loadChildren: "./pages/take-exams/take-exams.module#TakeExamsPageModule",
    canActivate: [AuthGuard]
  },
  { path: 'view-my-student', loadChildren: './pages/view-my-student/view-my-student.module#ViewMyStudentPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
