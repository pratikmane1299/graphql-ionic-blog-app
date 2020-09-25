import { Injectable } from '@angular/core';
import { from, BehaviorSubject } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Apollo } from 'apollo-angular';

import { SIGN_UP_MUTATION, LOGIN_MUTATION, SignUpMutationResponse, LoginMutationResponse } from './../graphql/mutations';

interface AuthInput {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  username: string;
  avatar_url: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubject = new BehaviorSubject<AuthResponse>(null);
  token$;

  constructor(
    private apollo: Apollo,
    private storage: Storage,
    private plt: Platform
  ) {
    this.token$ = from(this.plt.ready()).pipe(
      switchMap(() => {
        return from(this.storage.get('loggedInUser'));
      }),
      map(user => {
        if (user) {
          this.userSubject.next(user);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  signUp(data: AuthInput) {
    return this.apollo.mutate<SignUpMutationResponse>({
      mutation: SIGN_UP_MUTATION,
      variables: {
        username: data.username,
        password: data.password
      }
    })
    .pipe(
      take(1),
      map(({ data }) => {
        return data.signUp;
      }),
      switchMap(user => {
        this.userSubject.next(user);
        return from(this.storage.set('loggedInUser', user));
      })
    );
  }

  login(data: AuthInput) {
    return this.apollo.mutate<LoginMutationResponse>({
      mutation: LOGIN_MUTATION,
      variables: {
        username: data.username,
        password: data.password
      }
    })
    .pipe(
      take(1),
      map(({ data }) => {
        return data.login;
      }),
      switchMap(user => {
        this.userSubject.next(user);
        return from(this.storage.set('loggedInUser', user));
      })
    );
  }
}
