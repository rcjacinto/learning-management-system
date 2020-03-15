import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { selectUser, RootState } from "src/app/store";
import { Class } from "src/app/models/class.model";
import { ClassService } from "src/app/services/class.service";
import { ActivityService } from "src/app/services/activity.service";
import { ModalController } from "@ionic/angular";
import { ViewActivityComponent } from "src/app/components/view-activity/view-activity.component";
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: "app-my-activities",
  templateUrl: "./my-activities.page.html",
  styleUrls: ["./my-activities.page.scss"]
})
export class MyActivitiesPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classlist: Class[] = [];
  selectedClass: Class;
  user: any;
  type = "quiz";
  quizlist = [];
  examslist = [];
  constructor(
    private store: Store<RootState>,
    private classService: ClassService,
    private activityService: ActivityService,
    public modalController: ModalController,
    public router: Router
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userData$.subscribe(user => {
      this.user = user;
      if (user) {
        this.classService.getClassByStudentId(user.id).subscribe(async list => {
          this.classlist = list;
          if (this.classlist[0]) {
            this.selectedClass = this.classlist[0];
            console.log(this.selectedClass);
          }
        });
      }
    });
  }

  getActivityByType(classId, type): any {
    return new Promise(res => {
      this.activityService
        .getActivityByType(classId, type)
        .subscribe(activities => {
          console.log(activities);

          res(activities);
        });
    });
  }

  async setSelectedClass() {
    this.quizlist = await this.getActivityByType(this.selectedClass.id, "quiz");
    this.examslist = await this.getActivityByType(
      this.selectedClass.id,
      "exams"
    );
  }

  convertToDate(date) {
    if(date){
      return new Date(date * 1000);
    }else{
      return null
    }
  }

  async takeExams(activity) {
    const navigationExtras: NavigationExtras = {
      state: {
        activity,
        user: this.user,
        selectedClass: this.selectedClass
      }
    };
    this.router.navigate(["take-exams"], navigationExtras);
  }
}
