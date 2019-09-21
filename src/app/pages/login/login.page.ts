import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NavController, ToastController, MenuController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store';
import { SetUser } from 'src/app/store/user/user.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  registerForm: FormGroup;
  loginIsClicked = false;
  submitted = false;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private navController: NavController,
    private toastController: ToastController,
    private store: Store<RootState>
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onLoginClick() {
    this.loginIsClicked = true;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService
      .doLogin(this.registerForm.value)
      .then(res => {
        console.log(res);
        this.userService.getUser(res.user.uid).subscribe(user => {
          console.log(user);
          user.id = res.user.uid;
          if (user.role === 'instructor') {
            this.store.dispatch(new SetUser(user));
            this.navController.navigateRoot('/tabs');
          } else {
            alert('not yet');
          }
          this.loading = false;
        });
      })
      .catch(err => {
        console.log(err);
        this.loading = false;
        this.presentToast(err.message, 'danger');
      });
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000
    });
    toast.present();
  }
}
