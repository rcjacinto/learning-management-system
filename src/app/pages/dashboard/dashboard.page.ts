import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddClassComponent } from 'src/app/components/add-class/add-class.component';
import { Class } from 'src/app/models/class.model';
import { ClassService } from 'src/app/services/class.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  segment = 'anouncements';
  classlist: Class[] = [];
  constructor(
    public modalController: ModalController,
    public classService: ClassService
  ) {
    classService.getclass().subscribe(list => {
      this.classlist = list;
    });
  }

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
