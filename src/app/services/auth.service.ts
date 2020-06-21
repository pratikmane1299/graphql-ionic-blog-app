import { Injectable } from '@angular/core';
import { from, BehaviorSubject } from 'rxjs';
import { take, map, switchMap } from 'rxjs/operators';

import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const signUpMutation = gql`
  mutation signUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      token
    }
  }
`;

const loginMutation = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

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

  private tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  token$;

  constructor(private apollo: Apollo, private storage: Storage, private plt: Platform) {
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

  getToken() {
    return this.tokenSubject.asObservable();
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
        return data.signUp.token;
      }),
      switchMap(token => {
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
        console.log(data);
        return data.login.token;
      }),
      switchMap(token => {
        return from(this.storage.set('loggedInUser', token));
      })
    );
  }
}
