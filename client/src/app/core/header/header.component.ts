import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthenticationService} from '../../shared/services/auth.service';
import {User} from "../../shared/models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  getState: Observable<any>;
  authenticated: false;
  currentUser: User;

  private loggedIn: boolean;

  constructor(public auth: AuthenticationService,
              private changeDetector: ChangeDetectorRef) {

    this.currentUser = this.auth.loadToken();
  }

  ngOnInit() {
     this.changeDetector.detectChanges();
  }

}
