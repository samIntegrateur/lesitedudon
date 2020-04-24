import { ChangeEvent } from "react";
import { FormControl, HTMLFormControlElement } from "../../../shared/types/form.type";

export interface InputProps {
  config: FormControl;
  changed: ((event: ChangeEvent<HTMLFormControlElement> | CustomEvent) => void);
}
