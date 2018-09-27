import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';


// import { FlashMessagesService } from 'angular2-flash-messages';

import { AuthenticationService } from '../shared/services/auth.service';


@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(
        public authService: AuthenticationService,
        public router: Router
        // public flashMessagesService: FlashMessagesService
    ) {}
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.authService.getTokenFromLocalStorage()) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }
    isLogged(): Observable<boolean> | Promise<boolean> | boolean {
      if (!this.authService.getTokenFromLocalStorage()) {
        return false;
      }
      return true;
    }
}
