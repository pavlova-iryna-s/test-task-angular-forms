import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import type { InputSignal, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import type { FormGroup } from '@angular/forms';

import type { IUserForm } from '../../models/user.model';
import { Country } from '../../../shared/enum/country';
import { InputValidationDirective } from '../../directives/input-validation.directive';

@Component({
    selector: 'app-user-card',
    standalone: true,
    templateUrl: './user-card.component.html',
    styleUrls: ['./user-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ReactiveFormsModule, InputValidationDirective]
})
export class UserCardComponent {
    form: InputSignal<FormGroup<IUserForm>> = input.required();

    countries: Signal<Country[]> = signal(Object.values(Country));
}
