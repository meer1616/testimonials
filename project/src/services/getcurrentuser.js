import poolData from "../config/userpool"


// const userPool = new CognitoUserPool(poolData);

export const getCurrentUser = () => {
    const cognitoUser = poolData.getCurrentUser();
    let userData = "";
    if (cognitoUser) {
        cognitoUser.getSession((err, session) => {
            if (err) {
                console.error('Error getting session:', err);
                return;
            }
            console.log('Session validity', session);
            userData = session;

            // cognitoUser.getUserAttributes((err, attributes) => {
            //     if (err) {
            //         console.error('Error getting user attributes:', err);
            //         return;
            //     }
            //     userData = attributes.reduce((acc, attribute) => {
            //         acc[attribute.getName()] = attribute.getValue();
            //         // console.log("attribute", acc);
            //         return acc;
            //     }, {});
            //     console.log('User attributes:', userData);
            //     return userData
            // });
        });
    } else {
        console.log('No user is currently logged in.');
    }
    return userData;
};

// Call the function to get the current user
