import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore:AngularFirestore,
              private auth:AuthService) { }


  createIngresoEgreso(ingresoEgreso:IngresoEgreso) {
    return this.firestore.doc(`${this.auth.user?.uid}/ingreso-egreso`)
              .collection('items')
              .add({...ingresoEgreso, uid:this.auth.user?.uid,});
  }

  deleteIngresoEgreso(uidItem:string) {
    return this.firestore
                  .doc(`${this.auth.user?.uid}/ingreso-egreso/items/${uidItem}`)
                  .delete();
  }

  initIngresosEgresosListener(uid:string) {
    return this.firestore.collection(`${uid}/ingreso-egreso/items`)
      .snapshotChanges()
      .pipe(
        map(snapshot  => snapshot.map(doc => {
                                            const data:any = doc.payload.doc.data();
                                            //return new IngresoEgreso(data.description, data.amount, data.type, doc.payload.doc.id);
                                            return {
                                              ...data,
                                              uid: doc.payload.doc.id
                                            }
                                      })
          )
      );
  }


}
