import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  submitted = false;
  registerForm: FormGroup;
  registering = false;
  userType = 'instructor';
  loading = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      classcode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  selectType(type) {
    this.userType = type;
    this.registering = true;
    if (type === 'instructor') {
      this.registerForm.get('classcode').setValue('code');
    } else {
      this.registerForm.get('classcode').setValue('');
    }
  }

  cancelRegistering() {
    this.registering = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value.name);
  }
}
