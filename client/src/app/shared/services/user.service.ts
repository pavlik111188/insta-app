import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {User} from '../models/user.model';

const token = localStorage.getItem('token');
const httpOptions = {
    headers: new HttpHeaders({ 'token': token})
};

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {
    }

    /**
     * Load all the users
     */
    public loadUsers(): Observable<User[]> {
        return this.http.get<User[]>(`/api/users`);
    }

    /**
     * Find an object by its identifier
     */
    public findById(id: any): Observable<User> {
        return this.http.get<User>(`/api/user/${id}`);
    }

    /**
     * Insert the user
     */
    public insertUser(user: User): Observable<Object> {
        return this.http.post<User>('/api/user', user, httpOptions);
    }

    /**
     * Update specific object into DB
     */
    public updateUser(user: User): Observable<User> {
        return this.http.put<User>(`/api/user/${user._id}`, user, httpOptions);
    }

    /**
     * Delete the user
     */
    public deleteUser(id): Observable<any> {
        // const params = new
        return this.http.delete(`/api/user/${id}`, httpOptions);
    }
}
