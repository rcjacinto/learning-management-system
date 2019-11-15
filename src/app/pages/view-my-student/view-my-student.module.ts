import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ViewMyStudentPage } from "./view-my-student.page";
import { ComponentsModule } from "src/app/components/components.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

const routes: Routes = [
  {
    path: "",
    component: ViewMyStudentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    Ng2SearchPipeModule
  ],
  declarations: [ViewMyStudentPage]
})
export class ViewMyStudentPageModule {}
