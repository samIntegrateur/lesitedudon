import { FirebaseOrderDir } from "../../firebase/firebase.type";

export interface OrderBy {
  value: string;
  dir: FirebaseOrderDir;
}
