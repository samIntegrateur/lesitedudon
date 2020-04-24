import React from "react";
import { FirebaseContextType } from "./firebase.type";

const FirebaseContext: React.Context<Partial<FirebaseContextType>> = React.createContext({});

export default FirebaseContext;
