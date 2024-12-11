import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import type { WritableSignal, Signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import type { FormArray, FormGroup } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest, map } from 'rxjs';

import { UserCardComponent } from '../user-card/user-card.component';
import type { IUserForm } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@UntilDestroy()
@Component({
    selector: 'app-users-form',
    standalone: true,
    templateUrl: './users-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [JsonPipe, ReactiveFormsModule, UserCardComponent]
})
export class UsersFormComponent implements OnInit {
    readonly usersForm: FormArray<FormGroup<IUserForm>> = this.fb.array<FormGroup<IUserForm>>([]);
    readonly maxUsersNumber: number = 10;

    showCancelButton: WritableSignal<boolean> = signal(false);

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

    constructor(
        private fb: NonNullableFormBuilder,
        private userApiService: UserService
    ) {}

    ngOnInit(): void {
        this.onAddUser();
    }

    onAddUser(): void {
        const userForm = this.fb.group<IUserForm>({
            country: this.fb.control('', {
                validators: [Validators.required],
                updateOn: 'change'
            }),
            username: this.fb.control('', {
                validators: [Validators.required],
                updateOn: 'change'
            }),
            birthday: this.fb.control('', {
                validators: [Validators.required],
                updateOn: 'change'
            })
        });

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
        this.toggleCancelButton();

        const data = this.usersForm.getRawValue();

        this.userApiService.addUsers(data).subscribe();
    }

    onCancel(): void {
        this.usersForm.enable();

        this.toggleCancelButton();
    }

    private toggleCancelButton() {
        this.showCancelButton.set(!this.showCancelButton());
    }
}
