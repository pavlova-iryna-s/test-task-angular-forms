import {
    Directive,
    ElementRef,
    Renderer2,
    OnInit,
    HostBinding,
    HostListener,
    ChangeDetectorRef,
    input
} from '@angular/core';
import type { InputSignal } from '@angular/core';
import { NgControl } from '@angular/forms';
import { combineLatest } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Directive({
    selector: '[appInputValidation]',
    standalone: true
})
export class InputValidationDirective implements OnInit {
    @HostBinding('class.is-invalid') get ngInvalid(): boolean {
        return this.isInvalid;
    }

    @HostBinding('class.is-valid') get ngValid(): boolean {
        return this.isValid;
    }

    @HostListener('blur') onBlur(): void {
        this.syncValidation();
    }

    fieldName: InputSignal<string> = input.required({
        alias: 'appInputValidation'
    });

    private isInvalid = false;
    private isValid = false;

    private readonly errorClassName = 'invalid-feedback';

    constructor(
        private cdr: ChangeDetectorRef,
        private formControl: NgControl,
        private renderer: Renderer2,
        private el: ElementRef
    ) {}

    ngOnInit(): void {
        const control = this.formControl.control;

        if (control) {
            combineLatest([control.statusChanges, control.valueChanges])
                .pipe(untilDestroyed(this))
                .subscribe(() => {
                    this.syncValidation();
                });
        }
    }

    private syncValidation(): void {
        const control = this.formControl.control;

        if (!control) {
            return;
        }

        this.isInvalid = control.status === 'INVALID';
        this.isValid = control.status === 'VALID';

        this.syncErrorMessage();
        this.cdr.markForCheck();
    }

    private syncErrorMessage(): void {
        const control = this.formControl.control;

        if (!control) {
            return;
        }

        const parentEl = this.el.nativeElement.parentElement;
        const existingErrorEl = parentEl.querySelector(`.${this.errorClassName}`);

        if (existingErrorEl) {
            this.renderer.removeChild(parentEl, existingErrorEl);
        }

        if (!control.invalid) {
            return;
        }

        const errorText = this.renderer.createText(`Please provide a correct ${this.fieldName()}`);
        const errorEl = this.renderer.createElement('div');

        this.renderer.addClass(errorEl, this.errorClassName);
        this.renderer.setStyle(errorEl, 'position', 'absolute');
        this.renderer.setStyle(errorEl, 'font-size', '12px');
        this.renderer.appendChild(errorEl, errorText);
        this.renderer.appendChild(parentEl, errorEl);
    }
}
