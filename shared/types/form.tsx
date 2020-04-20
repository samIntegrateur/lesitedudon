import { GeoCity } from "./geo";

export interface Form {
  [key: string]: FormControl;
}

export interface ComplexValue {
  displayValue: '';
  completeValue: null;
}

export interface FormControl {
  elementType: string;
  value: string | ComplexValue;
  elementConfig?: {
    type?: string;
    placeholder?: string;
    autoComplete?: string;
  };
  label?: string;
  validation?: Rules;
  valid?: boolean;
  touched?: boolean;
  autocomplete?: {
    apiCallFunction: Function;
    resultKey: string;
    resultDisplay: string | {
      values: string[];
      separator: string;
    };
  };
  errors?: string[];
}

export interface Rules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  fileMaxSize?: number;
  geoCity?: boolean;
}
