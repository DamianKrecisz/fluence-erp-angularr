import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AuthState } from 'src/app/states/auth.state';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.less']
})
export class TopNavbarComponent implements OnInit {

  // @Select(AuthState.getCurrentUser) getCurrentUser$: Observable<any>;

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  logOut() {
    this.authService.logout();
  }

  get currentUserMail() {
    return this.authService.getUserEmail();
  }

}
