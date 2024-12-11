import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { map, Observable, of } from 'rxjs';

import { UserService } from '../services/user.service';
import { ICheckUserResponseData } from '../../shared/models/responses.model';

@Injectable({
    providedIn: 'root'
})
export class UserExistsValidator {
    constructor(private userService: UserService) {}

    createValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            const username: string = control.value;

            if (!username) {
                return of({ invalidUser: true });
            }

            return this.userService.validateUsername(username).pipe(
                map((response: ICheckUserResponseData) => {
                    return response.isAvailable ? null : { userExists: true };
                })
            );
        };
    }
}
