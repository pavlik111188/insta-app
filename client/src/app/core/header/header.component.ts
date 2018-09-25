import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../shared/services/auth.service";
// import {AuthGuardService} from "../../auth/auth-guard.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    // this.authGuardService.canActivate();
  }

}
