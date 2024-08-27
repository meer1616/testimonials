import { AuthenticationDetails, CognitoUser } from "amazon-cognito-identity-js"
import userpool from "../config/userpool"

export const authenticate = (Email, Password) => {
    return new Promise((resolve, reject) => {
        const user = new CognitoUser({
            Username: Email,
            Pool: userpool
        })

        const authDetails = new AuthenticationDetails({
            Username: Email,
            Password
        })
        user.authenticateUser(authDetails, {
            onSuccess: data => {
                console.log("onSuccess", data)
                resolve(data)
            },
            onFailure: err => {
                console.error("onFailure", err)
                reject(err)
            },
        })
    })
}


export const logout = () => {
    const user = userpool.getCurrentUser()
    console.log("user in logout", user);
    if (user) {
        user.signOut()
        window.location.href = "/login"
    }
}
