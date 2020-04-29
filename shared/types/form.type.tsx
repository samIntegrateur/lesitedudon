import { RefObject } from "react";

export interface FormType {
  [key: string]: FormControl;
}

export interface ComplexValue {
  displayValue: '';
  completeValue: any;
}

export interface ElementConfig {
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  ref?: RefObject<HTMLFormControlElement>;
  options?: {
    value: any;
    displayValue: string;
  }[];
}

export interface Autocomplete {
  apiCallFunction: Function;
  resultKey: string;
  resultDisplay: string | {
    values: string[];
    separator: string;
  };
}

export interface FormControl {
  elementType: string;
  value: string | ComplexValue;
  elementConfig?: ElementConfig;
  label?: string;
  validation?: Rules;
  valid?: boolean;
  touched?: boolean;
  autocomplete?: Autocomplete;
  errors?: string[];
  hideErrors?: boolean;
}

export interface Rules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  fileMaxSize?: number;
  geoCity?: boolean;
  fileExtension?: string[];
}

export type HTMLFormControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Initially made to handle base64 image
// Maybe use ts built-in FormData instead ?
export interface CustomFormData {
  [key: string]: string | ComplexValue;
}
