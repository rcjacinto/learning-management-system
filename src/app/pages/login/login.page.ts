import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NavController } from '@ionic/angular';

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
    private navController: NavController
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

    this.authService
      .doLogin(this.registerForm.value)
      .then(res => {
        console.log(res);
        this.navController.navigateRoot('/tabs');
      })
      .catch(err => {
        console.log(err);
      });
  }
}
