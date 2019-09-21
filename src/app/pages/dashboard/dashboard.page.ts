import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddClassComponent } from 'src/app/components/add-class/add-class.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  segment = 'anouncements';
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddClassComponent,
      componentProps: { value: 123 },
      cssClass: 'add-class-modal',
      backdropDismiss: true,
      showBackdrop: true
    });

    await modal.present();
  }
}
