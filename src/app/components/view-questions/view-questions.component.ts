import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-questions',
  templateUrl: './view-questions.component.html',
  styleUrls: ['./view-questions.component.scss']
})
export class ViewQuestionsComponent implements OnInit {
  @Input() activity: any;
  segment = 'details';
  type = 'mc';

  constructor(public modalController: ModalController) {}

  ngOnInit() {
    this.activity.deadline = this.convertToDate(
      this.activity.deadline
    ).toString();
    console.log(this.activity);
  }

  close() {
    this.modalController.dismiss();
  }

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  selectType(event) {
    this.type = event.target.value;
  }

  convertToDate(date) {
    return new Date(date.seconds * 1000);
  }
}
