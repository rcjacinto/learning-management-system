import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { ActivityService } from 'src/app/services/activity.service';

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
    private activityService: ActivityService
  ) {
    this.userData$.subscribe(user => {
      this.user = user;

      classService.getAllclasses(user.id).subscribe(async list => {
        this.classlist = list;
        if (this.classlist[0]) {
          this.selectedClass = this.classlist[0];
          console.log(this.selectedClass);
        }
      });
    });
  }

  ngOnInit() {}

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
    return new Date(date * 1000);
  }
}
