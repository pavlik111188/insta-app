import { Component, OnDestroy, OnInit } from '@angular/core';
import {AuthenticationService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-logout',
  template: ''
})
export class LogoutComponent implements OnDestroy, OnInit {

  /**
   * Component state.
   */
  private alive = true;

  constructor(private auth: AuthenticationService) { }

  ngOnInit() {
    this.auth.logout();
  }

  public ngOnDestroy() {
    this.alive = false;
  }

}
