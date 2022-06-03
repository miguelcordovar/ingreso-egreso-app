import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';

import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription!:Subscription;
  private _user!:User | null;

  constructor(public auth:AngularFireAuth,
              public store:Store<AppState>,
              public firestore:AngularFirestore) { }

  initAuthServiceListener() {
    this.auth.authState.subscribe(fbUser => {
      if (fbUser) {
          this.userSubscription = this.firestore.doc(`${fbUser?.uid}/user`)
                                      .valueChanges()
                                      .subscribe( (fsUser:any) => {
                                        const { uid, username, email} = fsUser;
                                        const user = new User(uid, username, email);
                                        this._user = user;
                                        this.store.dispatch(authActions.setUser({user}));
                                      });
      } else {
          if (this.userSubscription)
            this.userSubscription.unsubscribe();

          if(this._user)
            this._user = null;

          this.store.dispatch(authActions.unsetUser());
          this.store.dispatch(ingresoEgresoActions.unsetItems());
      }
    });

  }

  get user() {
    return this._user;
  }


  async createUser(username:string, email:string, password:string) {
    const { user } = await this.auth.createUserWithEmailAndPassword(email, password);
    const newUser = new User(user?.uid!, username, user?.email!);
    return await this.firestore.doc(`${user?.uid!}/user`).set({...newUser});
  }


  loginUser(email:string, password:string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState
            .pipe(
              map(fbUser => fbUser != null)
            );
  }


}
