import { Container } from "@mui/material";
import React, { ReactNode } from "react";
import AlertsManagerAlert from "./AlertsManagerAlert";
import AlertsManagerContext, { AlertMessage } from "./AlertsManagerContext";

export declare interface AlertMessageWithKey extends AlertMessage {
  key: number;
}

// Alert messages are stored outside of the React State to avoid concurrency issues
const alertMessages: { [key: number]: AlertMessageWithKey } = {};

// Define a TypeScript Type for the AlertsManager Props
// Matches declaration of the children props from the React Fragment definition
declare type AlertsManagerProps = {
  children?: ReactNode | undefined;
};

/**
 * Alerts Manager
 * @description A self-contained user alert system.
 */
const AlertsManager: React.FunctionComponent<AlertsManagerProps> = ({
  children,
}) => {
  // Creates a state to keep track of the current alert messages
  const [updatedAt, setUpdatedAt] = React.useState<number>(0);

  // Add a new alert message
  const addAlertMessage = (alertMessage: AlertMessage) => {
    // Add the new alert message to storage
    const key = Date.now();
    alertMessages[key] = {
      key,
      ...alertMessage,
    };

    // Re-render the open alerts
    setUpdatedAt(Date.now());

    // Automatically remove the alert message after 10 seconds.
    setTimeout(() => {
      removeAlertMessage(key);
    }, 10000);
  };

  // Remove an alert message
  const removeAlertMessage = (key: number) => {
    // Remove the alert message from storage
    delete alertMessages[key];

    // Re-render the open alerts
    setUpdatedAt(Date.now());
  };

  // Use the updatedAt field to eat the "@typescript-eslint/no-unused-vars" error
  (() => updatedAt)();

  return (
    <AlertsManagerContext.Provider value={{ addAlertMessage }}>
      <Container>
        {Object.keys(alertMessages)
          .sort()
          .map((key) => {
            const alertMessage = alertMessages[key as any];
            return (
              <AlertsManagerAlert
                key={`AlertMessage_${key}`}
                alertMessage={alertMessage}
                removeAlertMessage={removeAlertMessage}
              />
            );
          })}
      </Container>
      {children}
    </AlertsManagerContext.Provider>
  );
};

export default AlertsManager;
