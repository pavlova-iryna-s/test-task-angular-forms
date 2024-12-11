import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { Country } from '../../shared/enum/country';

export const createCountryValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const country = control.value;

        if (!country) {
            return null;
        }

        const countries = Object.values(Country);

        return countries.includes(country) ? null : { invalidCountry: true };
    };
};
