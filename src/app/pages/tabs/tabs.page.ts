import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RootState, selectUser } from 'src/app/store';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  userData$ = this.store.pipe(select(selectUser));
  constructor(public store: Store<RootState>, public router: Router) { 
    this.userData$.pipe(take(1)).subscribe(user => {
      if (user.role === 'student') {
        router.navigate(['/student-dashboard']);
      } else if (user.role === 'parent') {
        router.navigate(['/view-my-student']);
      }
    });
  }

  ngOnInit() {
  }

}
