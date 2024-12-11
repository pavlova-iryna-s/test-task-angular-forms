import { ChangeDetectionStrategy, Component, input, InputSignal, signal, Signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import type { IUserForm } from '../../models/user.model';
import { Country } from '../../../shared/enum/country';

@Component({
    selector: 'app-user-card',
    standalone: true,
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule]
})
export class UserCardComponent {
    form: InputSignal<FormGroup<IUserForm>> = input.required();

    countries: Signal<Country[]> = signal(Object.values(Country));
}
