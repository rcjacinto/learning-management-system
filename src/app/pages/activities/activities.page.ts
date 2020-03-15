import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { ActivityService } from 'src/app/services/activity.service';
import { ModalController } from '@ionic/angular';
import { ViewActivityComponent } from 'src/app/components/view-activity/view-activity.component';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.page.html',
  styleUrls: ['./activities.page.scss']
})
export class ActivitiesPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classlist: Class[] = [];
  selectedClass: Class;
  user: any;
  type = 'quiz';
  quizlist = [];
  examslist = [];
  constructor(
    private store: Store<RootState>,
    private classService: ClassService,
    private activityService: ActivityService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userData$.subscribe(user => {
      this.user = user;
      if (user) {
        this.classService.getAllclasses(user.id).subscribe(async list => {
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
    this.quizlist = await this.getActivityByType(this.selectedClass.id, 'quiz');
    this.examslist = await this.getActivityByType(
      this.selectedClass.id,
      'exams'
    );
  }

  convertToDate(date) {
    if(date){
      return new Date(date * 1000);
    }else{
      return null
    }
  }

  async viewActivity(activity) {
    this.activityService
      .getSubmitByActivity(activity.id)
      .subscribe(async submits => {
        const modal = await this.modalController.create({
          component: ViewActivityComponent,
          componentProps: {
            activity,
            submits,
            selectedClass: this.selectedClass
          }
        });

        await modal.present();
      });
  }
}
