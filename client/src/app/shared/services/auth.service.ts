import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import {User} from '../models/user.model';

@Injectable()
export class AuthenticationService {

    public domain: string = 'http://localhost:8085';

    TOKEN_VARIABLE: string = 'token';

    currentUser: User = new User();

    constructor(private http: HttpClient,
                private router: Router,
                private jwtHelper: JwtHelperService) {


        const token = localStorage.getItem('token');
        if (token) {
            const decodedUser = this.decodeUserFromToken(token);
            this.setCurrentUser(decodedUser);
        }
    }

    getTokenFromLocalStorage() {
        return localStorage.getItem(this.TOKEN_VARIABLE);
    }

    loadToken(): User {
        if (this.getTokenFromLocalStorage()) {
          return this.currentUser;
        }
    }

    login(credentials): Observable<any> {
        return this.http.post<any>(this.domain + '/api/login', credentials).do(
            res => {

                if (res['success']) {
                  localStorage.setItem('token', res.token);
                  const decodedUser = this.decodeUserFromToken(res.token);
                  this.setCurrentUser(decodedUser);
                  this.router.navigate(['/']);
                }
            }
        );
    }

    signup(user: User): Observable<User> {
        return this.http.post<User>(this.domain + '/api/signup', user);
    }

    logout() {
        localStorage.removeItem('token');
        this.currentUser = new User();
        this.router.navigate(['/']);
    }

    decodeUserFromToken(token) {
        return this.jwtHelper.decodeToken(token).user;
    }

    setCurrentUser(decodedUser) {
        this.currentUser._id = decodedUser._id;
        this.currentUser.first_name = decodedUser.first_name;
        this.currentUser.email = decodedUser.email;
        this.currentUser.role = decodedUser.role;
        delete decodedUser.role;
    }

    checkToken(token): Observable<any> {
        return this.http.get<any>(this.domain + '/api/check_token/' + token);
    }

    forgotPass(email): Observable<any> {
      return this.http.post<any>(this.domain + '/api/forgot_pass', email).do(
        res => {
          // console.log(res);
        }
      );
    }

    resetPass(user): Observable<User> {
      return this.http.post<User>(this.domain + '/api/reset_pass', user).do(
        res => {
          // console.log(res);
        }
      );
    }

}
