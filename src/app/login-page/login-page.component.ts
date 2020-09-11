import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Login } from '../actions/auth.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {

  public loginMode = true;

  constructor(private router: Router, private authService: AuthService, private store: Store) {}

  ngOnInit() {
  }

  logIn(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        this.router.navigate(['']);
      }
    });
  }

  setToSignUpMode() {
    this.loginMode = false;
  }
}
