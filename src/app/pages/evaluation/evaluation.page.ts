import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { Observable } from 'rxjs';
import { ClassService } from 'src/app/services/class.service';
import { Class } from 'src/app/models/class.model';
import { EvaluatedService } from 'src/app/services/evaluated.service';
import { EvaluationService } from 'src/app/services/evaluation.service';

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.page.html',
  styleUrls: ['./evaluation.page.scss'],
})
export class EvaluationPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  classlist: Class[] = [];
  user: any;
  evalInfo: any;
  selectedClass: Class;
  comments:any;
  questionInfo: any;
  constructor(
    public store: Store<RootState>,
    public toastController: ToastController,
    public modalController: ModalController,
    public classService: ClassService,
    public evaluated: EvaluatedService,
    public evalQuestion: EvaluationService
    ) { }

  ngOnInit() {
  }
  async setSelectedClass() {
    console.log(this.selectedClass);
    this.getEvalInfo(this.user,this.selectedClass);
  }
  ionViewWillEnter() {
    this.userData$.subscribe(user => {
      this.user = user;
      if (user) {
        this.classService.getClassByStudentId(user.id).subscribe(async list => {
          this.classlist = list;
          if (this.classlist[0]) {
            this.selectedClass = this.classlist[0];
          }
        });
      }
    });
  }
  getEvalInfo(userInfo,classInfo) {
    console.log(userInfo,classInfo);
    this.evaluated.getEvalByInfo(userInfo.id,classInfo.id).subscribe(res=>{
      if (res.length!==0) {
        this.evalInfo = res[0];
      } else {
        this.getEvalQuestion();
      }
    })
  }
  getEvalQuestion () {
    this.questionInfo = [];
    this.evalQuestion.getEval().subscribe(res=>{
      let quest = res;
      quest.filter(e=>{
        if(e.status==='Active'){
          this.questionInfo.push({...e, answer:0 });
        }
      });
      console.log(this.questionInfo)
    })
  }
  toggleAns(val,id){
    this.questionInfo[id].answer = val;
    console.log(this.questionInfo);
  }
  submitEval() {
    let totalAns = 0;
    let validForm = 0;
    let totalQ = this.questionInfo.length;
    let totalScore = 0;
    this.questionInfo.filter(f=>{
      if(f.answer===0){
        validForm = 1;
      }
      totalAns += f.answer;
    });
    if(validForm){
    }else{
      totalScore = totalAns / totalQ;
      console.log(totalScore,this.comments);
      let payload = {
        id:'',
        student_id:this.user.id,
        class_id:this.selectedClass.id,
        instructor_id:this.selectedClass.instructor.id,
        total_rating: totalScore,
        date_rated: new Date(),
        eval_data: this.questionInfo,
        comments: this.comments
      }
      this.evaluated.addEval(payload).then(res=>{
        payload.id = res.id
        this.evaluated.updateEval(payload);
        this.getEvalInfo(this.user,this.selectedClass);
      })
    }
  }

}
