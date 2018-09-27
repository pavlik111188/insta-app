import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {User} from '../models/user.model';

@Injectable()
export class UserService {

    public domain: string = 'http://localhost:8085';
    public token = localStorage.getItem('token');
    public httpOptions = {
              headers: new HttpHeaders({ 'Authorization': this.token})
            };

    constructor(private http: HttpClient) {
    }

    public loadUserHistory(): Observable<History[]> {
        return this.http.get<History[]>(`${this.domain}/api/history`, this.httpOptions);
    }

    public getCurrentUser(): Observable<User> {
      return this.http.get<User>(this.domain + '/api/user/', this.httpOptions);
    }

    public sendBalance(params): Observable<any> {
      return this.http.post<any>(this.domain + '/api/balance/', params, this.httpOptions);
    }
}
