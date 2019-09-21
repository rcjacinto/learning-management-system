import { Injectable } from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore
} from '@angular/fire/firestore';
import { Class } from '../models/class.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private classCollection: AngularFirestoreCollection<Class>;

  private classes: Observable<Class[]>;

  constructor(db: AngularFirestore) {
    this.classCollection = db.collection<Class>('class');

    this.classes = this.classCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getclass() {
    return this.classes;
  }

  getClass(id) {
    return this.classCollection.doc<Class>(id).valueChanges();
  }

  updateClass(classes: Class, id: string) {
    return this.classCollection.doc(id).update(classes);
  }

  addClass(classes: Class) {
    return this.classCollection.add(classes);
  }

  removeClass(id) {
    return this.classCollection.doc(id).delete();
  }
}
