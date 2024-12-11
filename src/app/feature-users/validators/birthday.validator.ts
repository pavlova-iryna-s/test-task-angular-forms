import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const isFutureDate = (date: Date) => {
    return date.setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0);
};

export const createBirthdayValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        const birthdayDate = new Date(control.value);

        return isFutureDate(birthdayDate) ? { invalidBirthday: true } : null;
    };
};
