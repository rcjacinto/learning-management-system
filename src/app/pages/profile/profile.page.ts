import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { User } from 'firebase';
import {
  AngularFireUploadTask,
  AngularFireStorage
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { SetUser } from 'src/app/store/user/user.action';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ClassService } from 'src/app/services/class.service';
import { LoadingController, ToastController } from '@ionic/angular';

export interface FileData {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {
  user$ = this.store.pipe(select(selectUser));
  currentUser: any;
  user: any;
  dateSelected = false;
  loading: any;

  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  images: Observable<FileData[]>;
  image: string;

  fileSize: number;

  constructor(
    private store: Store<RootState>,
    private storage: AngularFireStorage,
    private userService: UserService,
    private classService: ClassService,
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  async ngOnInit() {
    this.user$.subscribe(user => {
      console.log(user);
      this.currentUser = user;
      this.user = JSON.parse(JSON.stringify(user));
    });
    this.loading = await this.loadingController.create({
      spinner: 'dots',
      message: 'Loading...'
    });
  }

  uploadImage(event) {
    this.loading.present();
    const file = event.target.files.item(0);

    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    const path = `profile_image/${Math.floor(
      Math.random() * 1000000
    )}${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file);
    this.percentage = this.task.percentageChanges();

    this.task.then(async result => {
      const url = await result.ref.getDownloadURL();
      this.user.image = url;
      this.userService.updateUser(this.user).then(res => {
        this.store.dispatch(new SetUser(this.user));
        this.user = this.user;

        this.presentToast('Profile updated!', 'success');

        this.loading.dismiss();
      });
    });
  }

  updateProfile() {
    this.loading.present();

    this.user.date.modified = new Date();
    this.userService.updateUser(this.user).then(() => {
      this.store.dispatch(new SetUser(this.user));
      this.user = JSON.parse(JSON.stringify(this.user));
      this.classService
        .getAllclasses(this.user.id)
        .pipe(take(1))
        .subscribe(classList => {
          classList.forEach(list => {
            list.instructor = {
              id: this.user.id,
              name: this.user.name.first + ' ' + this.user.name.last
            };

            this.classService.updateClass(list);
          });
        });
      this.presentToast('Profile updated!', 'success');
      this.loading.dismiss();
    });
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }
}
