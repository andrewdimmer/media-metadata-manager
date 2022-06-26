import React from "react";

// Define a TypeScript Type for the AlertMessage
export declare interface AlertMessage {
  severity: "error" | "warning" | "info" | "success";
  title?: string;
  message: string;
}

// Define a TypeScript Type for the AlertsManagerContext
export declare type AlertsManagerContextType = {
  addAlertMessage: (alertMessage: AlertMessage) => void;
};

// Defines a context provider for the alert message information; prevents needing to pass it via props
const AlertsManagerContext = React.createContext<AlertsManagerContextType>({
  addAlertMessage: () => {
    console.log(
      "No Provider found for the AlertManagerContext. Please check this call was from within a Provider."
    );
  },
});

export default AlertsManagerContext;
