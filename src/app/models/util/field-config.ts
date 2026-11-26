import { SelectOption } from "./select-option";

export interface FieldConfig {
    id: number;
    name: string;
    label: string;
    value?: any;
    type: 'text' | 'email' | 'password' | 'number' | 'date';
    controlType: 'input' | 'select' | 'textarea' | 'datepicker';
    label_hint?: string;
    options?: Array<SelectOption>;
    validators?: any[];
    max?: number;
    min?: number;
}
