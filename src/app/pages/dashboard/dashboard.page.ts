import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AddClassComponent } from 'src/app/components/add-class/add-class.component';
import { Class } from 'src/app/models/class.model';
import { ClassService } from 'src/app/services/class.service';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { PostsService } from 'src/app/services/posts.service';
import { Post } from 'src/app/models/posts.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  user: any;
  segment = 'anouncements';
  classlist: Class[] = [];
  selectedClass: Class;
  postlist: any[] = [];
  message = '';
  postType = 0;
  attachments = [];
  loading = false;
  constructor(
    public modalController: ModalController,
    public classService: ClassService,
    public store: Store<RootState>,
    public postService: PostsService,
    public toastController: ToastController
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.userData$.subscribe(user => {
      this.user = user;
      if (user) {
        this.classService.getAllclasses(user.id).subscribe(async list => {
          this.classlist = list;
          console.log('list',list);
          if (this.classlist[0]) {
            this.selectedClass = this.classlist[0];
            console.log(this.selectedClass);
            this.postService
              .getPostsByClass(this.selectedClass.id)
              .subscribe(posts => {
                this.postlist = posts;
              });
          }
        });
      }
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddClassComponent,
      componentProps: { value: 123 },
      cssClass: 'add-class-modal',
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
  }

  getPosts(classId): any {
    return new Promise(res => {
      this.postService.getPostsByClass(classId).subscribe(posts => {
        res(posts);
      });
    });
  }

  async setSelectedClass() {
    this.postlist = await this.getPosts(this.selectedClass.id);
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }

  addPost() {
    if (this.message.trim() == '') {
      return;
    }

    const newPost: Post = {
      id: '',
      attachments: this.attachments,
      message: this.message,
      posted_by: this.user,
      posted_to: this.selectedClass,
      type: this.postType,
      date: {
        created: new Date(),
        modified: new Date()
      }
    };

    this.loading = true;

    this.postService
      .addPost(newPost)
      .then(async res => {
        newPost.id = res.id;
        this.postService.updatePost(newPost);
        this.alertToast('Posted!', 'success');
        this.loading = false;
        this.clearMessage();
        this.postlist = await this.getPosts(this.selectedClass.id);
      })
      .catch(err => {
        this.alertToast(err, 'danger');
        this.loading = false;
      });
  }

  clearMessage() {
    this.message = '';
    this.attachments = [];
  }

  async alertToast(message, color) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }
}
