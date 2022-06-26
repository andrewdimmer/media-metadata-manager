import { Alert, AlertTitle, styled } from "@mui/material";
import React from "react";
import { AlertMessageWithKey } from "./AlertsManager";

const AlertStyleWrapper = styled("div")(({ theme }) => ({
  margin: theme.spacing(2),
}));

// Define a TypeScript Type for the AlertsManagerAlert Props
declare type AlertsManagerAlertProps = {
  alertMessage: AlertMessageWithKey;
  removeAlertMessage: (key: number) => void;
};

const AlertsManagerAlert: React.FunctionComponent<AlertsManagerAlertProps> = ({
  alertMessage,
  removeAlertMessage,
}) => {
  return (
    <AlertStyleWrapper>
      <Alert
        severity={alertMessage.severity}
        onClose={() => {
          removeAlertMessage(alertMessage.key);
        }}
      >
        {alertMessage.title && <AlertTitle>{alertMessage.title}</AlertTitle>}
        {alertMessage.message}
      </Alert>
    </AlertStyleWrapper>
  );
};

export default AlertsManagerAlert;
