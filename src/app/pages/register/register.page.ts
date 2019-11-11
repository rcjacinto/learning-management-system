import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Student } from 'src/app/models/student.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  submitted = false;
  registerForm: FormGroup;
  registering = false;
  role = 'instructor';
  loading = false;
  studRegisterForm: FormGroup;
  instructorRegisterForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public authService: AuthService,
    public userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {
    this.initForms();
  }

  initForms() {
    this.submitted = false;
    this.registering = false;
    this.role = 'instructor';
    this.studRegisterForm = this.formBuilder.group({
      studid: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    });

    this.instructorRegisterForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]]
    });
  }
  get student() {
    return this.studRegisterForm.controls;
  }

  get instructor() {
    return this.instructorRegisterForm.controls;
  }

  selectType(type) {
    this.role = type;
    this.registering = true;
  }

  cancelRegistering() {
    this.registering = false;
  }

  registerAccount() {
    this.submitted = true;

    if (this.role == 'student') {
      const {
        studid,
        name,
        email,
        password,
        password2
      } = this.studRegisterForm.value;

      if (this.studRegisterForm.invalid) {
        return;
      }

      if (password != password2) {
        return this.presentToast('Password did not match!', 'danger');
      }

      this.loading = true;

      this.authService
        .doRegister(this.studRegisterForm.value)
        .then(data => {
          console.log(data);

          const newStudent: Student = {
            id: data.user.uid,
            student_number: studid,
            email,
            name: {
              first: name,
              last: '',
              mi: ''
            },
            address: '',
            dob: new Date(),
            course: '',
            gender: '',
            image: 'assets/images/profile.jpg',
            mobile: 0,
            role: 'student',
            classes: [],
            parents: [],
            date: {
              created: new Date(),
              modified: new Date()
            },
            status: 1
          };

          this.userService
            .addStudent(newStudent)
            .then(() => {
              this.presentToast('Register success!', 'success');
              this.loading = false;
              this.router.navigate(['/login']);
              this.initForms();
            })
            .catch(err => {
              this.presentToast(err, 'danger');
              this.loading = false;
            });
        })
        .catch(err => {
          this.presentToast(err, 'danger');
          this.loading = false;
        });
    } else if (this.role == 'instructor') {
      const {
        name,
        email,
        password,
        password2
      } = this.instructorRegisterForm.value;

      if (this.instructorRegisterForm.invalid) {
        return;
      }

      if (password != password2) {
        this.presentToast('Password did not match!', 'danger');
        return;
      }

      this.loading = true;

      this.authService
        .doRegister(this.instructorRegisterForm.value)
        .then(data => {
          console.log(data);

          const newInstructor: User = {
            id: data.user.uid,
            email,
            name: {
              first: name,
              last: '',
              mi: ''
            },
            status: 0,
            address: '',
            dob: new Date(),
            gender: '',
            image: 'assets/images/profile.jpg',
            mobile: 0,
            role: 'instructor',
            date: {
              created: new Date(),
              modified: new Date()
            }
          };

          this.userService
            .addUser(newInstructor)
            .then(() => {
              this.presentToast('Register success!', 'success');
              this.loading = false;
              this.router.navigate(['/login']);
              this.initForms();
            })
            .catch(err => {
              this.presentToast(err, 'danger');
              this.loading = false;
            });
        })
        .catch(err => {
          this.presentToast(err, 'danger');
          this.loading = false;
        });
    }
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
