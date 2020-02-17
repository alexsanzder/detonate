import * as React from "react";
import { GoogleProfile } from "../hooks/useGoogle";

export const GoogleContext = React.createContext<GoogleProfile>({
  googleId: ""
});
