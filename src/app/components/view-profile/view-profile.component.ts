import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {
  @Input() user: any;
  constructor(public modalController: ModalController) {}

  ngOnInit() {}
  close() {
    this.modalController.dismiss();
  }
}
