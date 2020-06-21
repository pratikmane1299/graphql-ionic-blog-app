import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AuthService } from '../services/auth.service';

const createUserMutation = gql`
  mutation signUp($username: String!, $password: String!) {
    signUp(username: $username, password: $password) {
      token
    }
  }
`;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  passwordType = 'password';
  isSecure = true;

  constructor(
    private apollo: Apollo,
    private loadingController: LoadingController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  toggleEye() {
    this.isSecure = !this.isSecure;
    this.isSecure ? this.passwordType = 'password' : this.passwordType = 'text';
  }

  async onSignup(signUpForm) {
    await this.showLoading();
    this.authService.signUp(signUpForm.form.value).subscribe(async res => {
      await this.loadingController.dismiss();
      this.router.navigateByUrl('/home');
    });
  }

  async showLoading() {
    const loader = await this.loadingController.create({
      message: 'Please Wait'
    });

    loader.present();
  }

}
