import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Activity } from "src/app/models/activity.model";
import { Question } from "src/app/models/question.model";
import { take } from "rxjs/operators";
import { ActivityService } from "src/app/services/activity.service";
import {
  LoadingController,
  ToastController,
  AlertController
} from "@ionic/angular";
import { Post } from "src/app/models/posts.model";
import { Class } from "src/app/models/class.model";
import { PostsService } from "src/app/services/posts.service";

@Component({
  selector: "app-take-exams",
  templateUrl: "./take-exams.page.html",
  styleUrls: ["./take-exams.page.scss"]
})
export class TakeExamsPage implements OnInit {
  activity: Activity;
  user: any;
  submit: any;
  loading = true;
  continuing: boolean;
  selectedQuestion: Question;
  timerStarted = false;
  loadingSpinner: any;
  submitted: boolean;
  selectedClass: Class;
  today = new Date();
  onView = false;

  countdownTimer: any;
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    public activityService: ActivityService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    public alertController: AlertController,
    public postService: PostsService
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.activity = this.router.getCurrentNavigation().extras.state.activity;
        this.user = this.router.getCurrentNavigation().extras.state.user;
        this.selectedClass = this.router.getCurrentNavigation().extras.state.selectedClass;
        console.log(this.activity);

        this.activityService
          .getSubmit(this.user.id, this.activity.id)
          .pipe(take(1))
          .subscribe(async sub => {
            if (sub.length > 0) {
              this.activity = sub[0].activity;
              this.submit = sub[0];
              console.log(this.submit);

              this.loading = false;
              this.continuing = this.submit.status == 1;
            } else {
              this.activity = this.activity;
              this.submit = {
                activity: this.activity,
                date: {
                  started: new Date(),
                  modified: new Date(),
                  submitted: null
                },
                status: 0,
                student: this.user,
                timer_left: this.activity.time_limit * 60,
                total_items: 0
              };
              await this.activityService.addSubmit(this.submit).then(res => {
                this.submit.id = res.id;
                this.loading = false;
              });
            }
            this.selectedQuestion = this.activity.questions[0];
          });
      } else {
        router.navigate(["/my-activities"]);
      }
    });
  }

  async ngOnInit() {
    this.loadingSpinner = await this.loadingController.create({
      spinner: "dots",
      message: "Loading..."
    });
  }

  ionViewDidLeave() {
    console.log("Timer Stopped");

    this.timerStop();
  }

  computeTotalPoints(questions: Question[]) {
    let total = 0;
    questions.forEach(question => {
      total += question.points;
    });

    return total;
  }

  startActivity() {
    this.timerStarted = true;
    this.submit.status = 1;
    this.activityService.updateSubmit(this.submit);
    this.timerStart();
  }

  setSelectedQuestion(question) {
    this.selectedQuestion = question;
  }

  nextQuestion() {
    const next = this.selectedQuestion.number + 1;
    this.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  prevQuestion() {
    const next = this.selectedQuestion.number - 1;
    this.activity.questions.forEach(question => {
      if (next == question.number) {
        this.setSelectedQuestion(question);
        return false;
      }
    });
  }

  setMcAnswer(answer) {
    this.selectedQuestion.answer = answer;
    this.activity.date.modified = new Date();
    console.log(this.submit);

    this.activityService.updateSubmit(this.submit);
  }

  setSaAnswer(event) {
    const value: string = event.target.value;
    const correct: string = this.selectedQuestion.options[0].value;
    const isCorrect = value.trim() == correct.trim();
    const answer = {
      key: "answer",
      value: value.trim(),
      isCorrect
    };
    this.selectedQuestion.answer = answer;
    this.submit.date.modified = new Date();
    this.activityService.updateSubmit(this.submit);
  }

  setTofAnswer(bool) {
    const value: string = bool;
    const correct: string = this.selectedQuestion.options[0].value;
    const isCorrect = value.trim() == correct.trim();
    const answer = {
      key: "answer",
      value,
      isCorrect
    };
    this.selectedQuestion.answer = answer;
    this.submit.date.modified = new Date();
    this.activityService.updateSubmit(this.submit);
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: "Confirm!",
      message: "Are you sure you want to submit?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Okay",
          handler: () => {
            this.submitActivity();
          }
        }
      ]
    });

    await alert.present();
  }

  submitActivity() {
    this.loadingSpinner.present();
    this.timerStop();
    const newSubmit = JSON.parse(JSON.stringify(this.submit));
    newSubmit.total_items = 0;
    newSubmit.score = 0;
    newSubmit.activity.questions.forEach((question: Question) => {
      newSubmit.total_items += question.points;
      if (!question.answer) {
        question.answer = {
          key: "",
          value: "No answer",
          isCorrect: false
        };
      }
      if (question.answer.isCorrect) {
        newSubmit.score += question.points;
      }
    });
    newSubmit.date.submitted = new Date();
    newSubmit.status = 2;
    this.activityService.updateSubmit(newSubmit).then(() => {
      this.submitted = true;
      this.activityService
        .getSubmit(this.user.id, this.submit.activity.id)
        .pipe(take(1))
        .subscribe(sub => {
          this.submit = sub[0];
          this.loadingSpinner.dismiss();
          this.presentToast("Activity submitted!", "success");
          this.activityService
            .getActivity(this.submit.activity.id)
            .pipe(take(1))
            .subscribe(act => {
              const newAct = act;
              newAct.id = this.submit.activity.id;
              if (!newAct.submits) {
                newAct.submits = [];
              }
              newAct.submits.push(this.submit.id);
              this.activityService.updateActivity(newAct);
              const newPost: Post = {
                id: "",
                attachments: [],
                message: "",
                posted_by: this.user,
                posted_to: this.selectedClass,
                type: 4,
                date: {
                  created: new Date(),
                  modified: new Date()
                },
                submit: newSubmit
              };

              console.log(newPost);

              this.postService.addPost(newPost);
              this.router.navigate(["/student-dashboard"]);
            });
        });
    });
  }

  timerStart() {
    this.countdownTimer = setInterval(() => {
      if (this.submit.timer_left > 0) {
        this.submit.timer_left--;
        this.activityService.updateSubmit(this.submit);
      } else {
        this.timerStop();
        this.presentToast("Times Up!", "danger");

        this.submitActivity();
      }
    }, 1000);
  }

  timerStop() {
    clearInterval(this.countdownTimer);
  }

  trunc(num: number) {
    return Math.trunc(num);
  }

  convertToDate(date) {
    return new Date(date * 1000);
  }

  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 2000
    });
    toast.present();
  }

  passed(score, item): boolean {
    return score >= item / 2;
  }

  hasEnded(): boolean {
    return (
      this.today > this.convertToDate(this.activity.deadline.seconds)
    );
  }

  viewActivity() {
    if (this.hasEnded()) {
      this.onView = true;
    } else {
      this.presentToast("Please wait after the deadline", "secondary");
    }
  }
}
