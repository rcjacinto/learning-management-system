import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storageSyncReducer, reducers } from './store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AddClassComponent } from './components/add-class/add-class.component';
import { FormsModule } from '@angular/forms';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { ViewActivityComponent } from './components/view-activity/view-activity.component';
import { ChartsModule } from 'ng2-charts';
import { ViewQuestionsComponent } from './components/view-questions/view-questions.component';

const metaReducers: Array<MetaReducer<any, any>> = [storageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    AddClassComponent,
    ViewProfileComponent,
    ViewActivityComponent,
    ViewQuestionsComponent
  ],
  entryComponents: [
    AddClassComponent,
    ViewProfileComponent,
    ViewActivityComponent,
    ViewQuestionsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    Ng2SearchPipeModule,
    AngularFirestoreModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument(),
    ChartsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
