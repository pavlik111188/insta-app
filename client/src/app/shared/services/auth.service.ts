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

    loadToken(): void {
        if (this.getTokenFromLocalStorage()) {
            // this.store.dispatch(new LoadTokenAction(this.getTokenFromLocalStorage()));
        }
    }

    login(credentials): Observable<any> {
        return this.http.post<any>('/api/login', credentials).do(
            res => {
              console.log(res);
                localStorage.setItem('token', res.token);
                const decodedUser = this.decodeUserFromToken(res.token);
                this.setCurrentUser(decodedUser);
                this.router.navigate(['/dashboard']);
            }
        );
    }

    signup(user: User): Observable<User> {
        return this.http.post<User>('/api/user', user).do(
            res => {
                this.router.navigate(['/login']);
            }
        );
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
        this.currentUser.photo = decodedUser.photo;

        delete decodedUser.role;
    }

    getCurrentUser(user: User): Observable<User> {
        return this.http.get<User>(`/api/user/${user._id}`);
    }

    forgotPass(email): Observable<any> {
      return this.http.post<User>('/api/auth/forgot_pass', email).do(
        res => {
          console.log(res);
        }
      );
    }

}
