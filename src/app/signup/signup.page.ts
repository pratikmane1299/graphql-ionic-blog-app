import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit, OnDestroy {

  passwordType = 'password';
  isSecure = true;
  signUpSubscription: Subscription;

  constructor(
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
    this.signUpSubscription = this.authService.signUp(signUpForm.form.value).subscribe(async res => {
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

  ngOnDestroy() {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
  }
}
