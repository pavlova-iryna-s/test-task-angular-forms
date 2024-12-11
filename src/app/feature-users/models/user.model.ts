import { FormControl } from '@angular/forms';

export interface IUser {
    country: string;
    username: string;
    birthday: string;
}

export interface IUserForm {
    country: FormControl<string>;
    username: FormControl<string>;
    birthday: FormControl<string>;
}
