import { ComplexValue } from "../../../shared/types/form.type";

export interface OfferFormProps {
  loading: boolean;
  error: Error;
  success: boolean;
  postId: string;
  onPostOffer: Function;
  onPostOfferClear: Function;
}

export interface OfferFormData {
  [key: string]: string | ComplexValue;
}
