import { Component } from '@angular/core';

import { Platform, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from './store';
import { SetUser } from './store/user/user.action';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  userData$ = this.store.pipe(select(selectUser));
  user: User;
  public appPages = [
    {
      title: 'Profile',
      url: '/profile',
      icon: 'ios-contact'
    },
    {
      title: 'Messages',
      url: '/messages',
      icon: 'chatboxes'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private autService: AuthService,
    private menuCotroller: MenuController,
    private alertController: AlertController,
    private store: Store<RootState>
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.userData$.subscribe(res => {
        console.log(res);
        this.user = res;
      });
      this.splashScreen.hide();
    });
  }

  logOut() {
    this.confirmLogout();
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'You are about to logout. Continue?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.menuCotroller.close();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            const empty = {
              id: '',
              role: '',
              name: {
                first: '',
                last: '',
                mi: ''
              },
              email: '',
              mobile: 0,
              dob: '',
              date: {
                created: '',
                modified: ''
              },
              image: '',
              gender: '',
              address: ''
            };
            this.autService.doLogout().then(() => {
              this.store.dispatch(new SetUser(null));
              this.menuCotroller.close();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
