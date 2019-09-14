import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-exams',
  templateUrl: './create-exams.page.html',
  styleUrls: ['./create-exams.page.scss']
})
export class CreateExamsPage implements OnInit {
  segment = 'details';
  type = 'mc';
  constructor() {}

  ngOnInit() {}

  segmentChanged(event) {
    this.segment = event.target.value;
  }

  selectType(event) {
    this.type = event.target.value;
  }
}
