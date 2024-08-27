import { CognitoUser } from "amazon-cognito-identity-js";
import userpool from "../config/userpool";

export const confirmUser = (Email, ConfirmationCode) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool,
        });

        user.confirmRegistration(ConfirmationCode, true, (err, result) => {
            if (err) {
                console.error("confirmRegistration error", err);
                reject(err);
            } else {
                console.log("confirmRegistration success", result);
                resolve(result);
            }
        });
    });
};
