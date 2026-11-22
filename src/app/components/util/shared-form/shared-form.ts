import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MaterialFormDialogModule } from '../../../material/material-module';
import { FieldConfig } from '../../../models/util/field-config';
import { FormErrorStateMatcher } from '../../../util/form-error-state-matcher';
import { FormService } from '../../../service/util/form-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Utils } from '../../../util/utils';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-shared-form[form][formConfigs]',
  imports: [MaterialFormDialogModule],
  templateUrl: './shared-form.html',
  styleUrl: './shared-form.css',
  providers: [provideNativeDateAdapter()]
})
export class SharedForm implements OnInit {

  // configuraciones para auto generar formulario
  // recibe el formulario ya configurado 
  @Input() form!: UntypedFormGroup;
  @Input() formConfigs!: FieldConfig[];
  @Input() botonText: string = 'Guardar';
  matcher = new FormErrorStateMatcher();

  private formService = inject(FormService);
  private _matSnackBar = inject(MatSnackBar)

  ngOnInit() {

  }

  // Emite  un evento al componente padre cuando se hace camios
  @Output() formSubmit = new EventEmitter<void>();

  getFormControl(control: string) {
    return this.form.get(control);
  }

  // compara ids del campo select
  compareIds(id1: any, id2: any): boolean {
    return id1.id == id2.id;
  }

  onSubmit() {
    if (this.formService.validateFormControls(this.form)) {
      this.formSubmit.emit();
    } else {
      Utils.openSnackBar('Datos incorrectos', 'ok', this._matSnackBar);
    }
  }
}
