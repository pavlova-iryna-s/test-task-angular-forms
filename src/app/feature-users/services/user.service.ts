import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ICheckUserResponseData, ISubmitFormResponseData } from '../../shared/models/responses.model';
import type { IUser } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) {}

    addUsers(users: IUser[]): Observable<ISubmitFormResponseData> {
        return this.http.post<ISubmitFormResponseData>('/api/submitForm', { users });
    }

    validateUsername(username: string): Observable<ICheckUserResponseData> {
        return this.http.post<ICheckUserResponseData>('/api/checkUsername', { username: username.toLowerCase() });
    }
}
