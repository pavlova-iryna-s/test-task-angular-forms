import { DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import type { WritableSignal, Signal } from '@angular/core';
import { AsyncValidatorFn, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, filter, map, Subscription, switchMap, tap, timer } from 'rxjs';

import { UserCardComponent } from '../user-card/user-card.component';
import type { IUser, IUserForm } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { createCountryValidator } from '../../validators/countries.validator';
import { createBirthdayValidator } from '../../validators/birthday.validator';
import { UserExistsValidator } from '../../validators/user-exists.validator';

@UntilDestroy()
@Component({
    selector: 'app-users-form',
    standalone: true,
    templateUrl: './users-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JsonPipe, ReactiveFormsModule, UserCardComponent, DatePipe]
})
export class UsersFormComponent implements OnInit {
    readonly usersForm: FormArray<FormGroup<IUserForm>> = this.fb.array<FormGroup<IUserForm>>([]);
    readonly maxUsersNumber: number = 10;

    showCancelButton: WritableSignal<boolean> = signal(false);
    untilSubmitTime: WritableSignal<number | undefined> = signal(undefined);

    invalidForms: Signal<number> = toSignal(
        combineLatest([this.usersForm.statusChanges, this.usersForm.valueChanges]).pipe(
            map(() => {
                return this.usersForm.controls.filter((control) => {
                    return control.status == 'INVALID' || control.status === 'PENDING';
                }).length;
            }),
            untilDestroyed(this)
        ),
        {
            initialValue: 0
        }
    );

    private timerSubscription?: Subscription;

    private readonly CANCEL_INTERVAL_SEC = 5;
    private readonly userValidator: AsyncValidatorFn = this.userExistsValidator.createValidator();

    constructor(
        private fb: NonNullableFormBuilder,
        private userExistsValidator: UserExistsValidator,
        private userApiService: UserService
    ) {}

    ngOnInit(): void {
        this.onAddUser();
    }

    onAddUser(): void {
        const userForm = this.fb.group<IUserForm>(
            {
                country: this.fb.control('', {
                    validators: [Validators.required, createCountryValidator()]
                }),
                username: this.fb.control('', {
                    asyncValidators: [this.userValidator],
                    validators: [Validators.required]
                }),
                birthday: this.fb.control('', {
                    validators: [Validators.required, createBirthdayValidator()]
                })
            },
            {
                updateOn: 'change'
            }
        );

        this.usersForm.push(userForm);
    }

    onRemoveUser(index: number): void {
        this.usersForm.removeAt(index);
    }

    onSubmit(): void {
        // @see https://itnext.io/valid-and-invalid-in-angular-forms-61cfa3f2a0cd
        if (!this.usersForm.valid) {
            return;
        }

        this.usersForm.disable();
        this.showCancelButton.set(true);

        this.submit(this.usersForm.getRawValue());
    }

    onCancel(): void {
        this.enableForm();
    }

    private submit(data: IUser[]): void {
        this.timerSubscription = timer(this.CANCEL_INTERVAL_SEC, 1000)
            .pipe(
                tap((seconds) => {
                    const msLeft = (this.CANCEL_INTERVAL_SEC - seconds) * 1000;

                    this.untilSubmitTime.set(msLeft);
                }),
                filter((seconds) => seconds === this.CANCEL_INTERVAL_SEC),
                switchMap(() => this.userApiService.addUsers(data)),
                untilDestroyed(this)
            )
            .subscribe(() => {
                /**
                 * NOTE: Make sure that redundant API requests are not triggered for removed form groups.
                 * Reset first, enable after
                 */
                this.resetForm();
                this.enableForm();
            });
    }

    private destroyTimer(): void {
        if (!this.timerSubscription) {
            return;
        }

        this.timerSubscription.unsubscribe();
        this.timerSubscription = undefined;
    }

    private enableForm(): void {
        this.destroyTimer();

        this.untilSubmitTime.set(undefined);
        this.showCancelButton.set(false);

        this.usersForm.enable();
    }

    private resetForm(): void {
        this.usersForm.clear();
        this.onAddUser();
        this.usersForm.reset();
    }
}
