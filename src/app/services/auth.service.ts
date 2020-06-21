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

interface SignUpInput {
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

  private token = new BehaviorSubject<string>(null);

  constructor(private apollo: Apollo, private storage: Storage, private plt: Platform) {
    from(this.plt.ready()).pipe(
      switchMap(() => {
        return from(this.storage.get('loggedInUser'));
      }),
      map(token => {
        if (token) {
          this.token.next(token);
          return true;
        } else {
          return false;
        }
      })
    );
  }

  getToken() {
    return this.token.asObservable();
  }

  signUp(data: SignUpInput) {
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
        console.log(data);
        return data.signUp.token;
      }),
      switchMap(token => {
        return from(this.storage.set('loggedInUser', token));
      })
    );
  }
}
