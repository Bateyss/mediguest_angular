import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";


export class FormErrorStateMatcher implements ErrorStateMatcher {
    isErrorHighlighted = true;

    isErrorStateInvalid(
        control: AbstractControl,
        _formGroup: FormGroup
    ): boolean {
        const hiddenError = this.isHideError(control);
        return !hiddenError && control.touched && control.invalid;
    }

    isHideError(control: AbstractControl): boolean {
        return control.touched && !control.errors;
    }

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
