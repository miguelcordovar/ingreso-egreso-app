import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';


import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth:AngularFireAuth,
              public firestore:AngularFirestore) { }

  initAuthServiceListener() {
    this.auth.authState.subscribe(fbUser => {
      console.log(fbUser);
      console.log(fbUser?.uid);
      console.log(fbUser?.email);
    })
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
    return this.auth.authState.pipe(
      map(fbUser => fbUser != null)
    );
  }


}
