import { Injectable } from '@angular/core';
import { from, BehaviorSubject } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Apollo } from 'apollo-angular';

import { signUpMutation, loginMutation } from './../graphql/mutations';

interface AuthInput {
  username: string;
  password: string;
}

interface SignUpResponse {
  signUp: {
    token: string
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  tokenSubject = new BehaviorSubject<string>(null);
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
      map(token => {
        if (token) {
          this.tokenSubject.next(token);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  get token(): string {
    return this.tokenSubject.value;
  }

  signUp(data: AuthInput) {
    return this.apollo.mutate({
      mutation: signUpMutation,
      variables: {
        username: data.username,
        password: data.password
      }
    })
    .pipe(
      take(1),
      map(({ data }) => {
        return data['signUp'].token;
      }),
      switchMap(token => {
        this.tokenSubject.next(token);
        return from(this.storage.set('loggedInUser', token));
      })
    );
  }

  login(data: AuthInput) {
    return this.apollo.mutate({
      mutation: loginMutation,
      variables: {
        username: data.username,
        password: data.password
      }
    })
    .pipe(
      take(1),
      map(({ data }) => {
        return data['login'].token;
      }),
      switchMap(token => {
        this.tokenSubject.next(token);
        return from(this.storage.set('loggedInUser', token));
      })
    );
  }
}
