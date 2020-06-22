import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  passwordType = 'password';
  isSecure = true;
  loginSubscription: Subscription;

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

  async onLogin(loginForm) {
    await this.showLoading();
    this.loginSubscription = this.authService.login(loginForm.form.value).subscribe(async res => {
      await this.loadingController.dismiss();
      console.log(res);
      this.router.navigateByUrl('/home');
    });
  }

  async showLoading() {
    const loader = await this.loadingController.create({
      message: 'Please Wait, Authenticating'
    });

    loader.present();
  }

  ngOnDestroy() {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

}
