import { Component, OnInit } from '@angular/core';
import {
  PickerController,
  ModalController,
  ToastController
} from '@ionic/angular';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';

@Component({
  selector: 'app-add-class',
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.scss']
})
export class AddClassComponent implements OnInit {
  classname = '';
  description = '';
  color = 'red';

  constructor(
    public pickerController: PickerController,
    public modalController: ModalController,
    public toastController: ToastController,
    public classService: ClassService
  ) {}

  ngOnInit() {}

  addClass() {
    if (this.classname.trim() === '' || this.description.trim() === '') {
      this.presentToast('All fields are required!', 'danger');
      return;
    }

    const newClass: Class = {
      name: this.classname,
      description: this.description,
      color: this.color,
      date: {
        created: new Date().toString(),
        modified: new Date().toString()
      }
    };

    this.classService.addClass(newClass);
    this.presentToast('New Class Added!', 'success');
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
      message,
      color,
      duration: 3000
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
}
