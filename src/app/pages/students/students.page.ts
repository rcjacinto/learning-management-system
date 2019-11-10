import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { Class } from 'src/app/models/class.model';
import { ClassService } from 'src/app/services/class.service';
import { UserService } from 'src/app/services/user.service';
import { ModalController } from '@ionic/angular';
import { ViewProfileComponent } from 'src/app/components/view-profile/view-profile.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.page.html',
  styleUrls: ['./students.page.scss']
})
export class StudentsPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: any;
  classlist: Class[] = [];
  selectedClass: Class;
  members = [];
  search = '';

  constructor(
    private store: Store<RootState>,
    private classService: ClassService,
    private userService: UserService,
    public modalController: ModalController
  ) {}

  async setSelectedClass() {
    console.log(this.selectedClass.members);

    if (this.selectedClass.members) {
      this.selectedClass.members.forEach(member => {
        this.userService.getUser(member).subscribe(student => {
          this.members.push(student);
        });
      });
    }
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.userData$.subscribe(user => {
      this.user = user;
      this.classService.getAllclasses(user.id).subscribe(async list => {
        this.classlist = list;
        if (this.classlist[0]) {
          this.selectedClass = this.classlist[0];
          console.log(this.selectedClass);
          if (this.selectedClass.members) {
            this.setSelectedClass();
          }
        }
      });
    });
  }

  async viewProfile(user) {
    const modal = await this.modalController.create({
      component: ViewProfileComponent,
      componentProps: { user }
    });

    await modal.present();
  }
}
