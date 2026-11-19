import { inject, Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FieldConfig } from '../../models/util/field-config';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  private formBuilder = inject(UntypedFormBuilder);

  validateFormControls(formm: UntypedFormGroup): boolean {
    var valido = formm.valid;
    var controls = formm.getRawValue();
    for (let index = 0; index < controls.length; index++) {
      if (controls[index]?.enabled && !controls[index]?.valid) valido = false;
    }
    return valido;
  }

  getFormGroup(fields: FieldConfig[]): UntypedFormGroup {
    var formGroupConfigs: any = {};
    if (fields && fields.length > 0) {
      fields.forEach(field => formGroupConfigs[field.name] = [field.value || '', field.validators || []]);
    }

    return this.formBuilder.group(formGroupConfigs);
  }

}
