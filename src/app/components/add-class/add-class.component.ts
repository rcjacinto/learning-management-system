import { Component, OnInit } from '@angular/core';
import {
  PickerController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { User } from 'src/app/models/user.model';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: User;
  classname = '';
  description = '';
  color = 'red';
  classCode = '';

  constructor(
    public pickerController: PickerController,
    public modalController: ModalController,
    public toastController: ToastController,
    public classService: ClassService,
    public store: Store<RootState>
  ) {
    this.userData$.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {}

  addClass() {
    if (this.classname.trim() === '' || this.description.trim() === '') {
      this.presentToast('All fields are required!', 'danger');
      return;
    }

    const code = this.randomCode();

    const newClass: Class = {
      members: [],
      name: this.classname,
      description: this.description,
      color: this.color,
      date: {
        created: new Date(),
        modified: new Date()
      },
      code,
      instructor: {
        name: `${this.user.name.first} ${this.user.name.last}`,
        id: this.user.id
      }
    };

    this.classService.addClass(newClass);
    this.presentToast('Classcode: ' + code, 'success');
    this.classname = '';
    this.description = '';
    this.color = 'red';
    this.dismissModal();
  }

  async chooseColor() {
    const picker = await this.pickerController.create({
      animated: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Clicked Save!')
        },
        {
          text: 'Select',
          handler: e => {
            console.log(e.Colors.value);

            this.color = e.Colors.value;
          }
        }
      ],
      columns: [
        {
          name: 'Colors',
          options: [
            {
              text: 'RED',
              value: 'red'
            },
            {
              text: 'BLUE',
              value: 'blue'
            },
            {
              text: 'GREEN',
              value: 'green'
            },
            {
              text: 'YELLOW',
              value: 'yellow'
            },
            {
              text: 'ORANGE',
              value: 'orange'
            },
            {
              text: 'GREY',
              value: 'grey'
            }
          ]
        }
      ],
      cssClass: 'color-select',
      mode: 'ios'
    });
    picker.present();
  }

  dismissModal() {
    this.modalController.dismiss({ dismiss: true });
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      animated: true,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ],
      color,
      cssClass: 'toast-success',
      header: 'New Class Added! ',
      keyboardClose: true,
      message,
      mode: 'ios',
      position: 'middle'
    });
    toast.present();
  }

  async presentToastMessage(message, color) {
    const toast = await this.toastController.create({
      animated: true,
      color,
      message,
      mode: 'ios',
      position: 'middle',
      duration: 2000
    });
    toast.present();
  }

  randomCode() {
    let result = '';
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 6; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  joinClass() {
    if (this.classCode.trim() === '') {
      return;
    }
    this.classService
      .getClassByCode(this.classCode)
      .pipe(take(1))
      .subscribe(snapshot => {
        if (snapshot.length > 0) {
          const newClass: Class = snapshot[0];
          if (newClass.members.includes(this.user.id)) {
            this.presentToastMessage(
              'Already a member of this class',
              'danger'
            );
          } else {
            newClass.members.push(this.user.id);
            this.classService.updateClass(newClass).then(() => {
              this.presentToastMessage('Class joined', 'success');

              this.dismissModal();
            });
          }
        } else {
          this.presentToastMessage('Please check the class code!', 'danger');
        }
      });
  }
}
