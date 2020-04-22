"use strict";

export class Social {
    constructor() {
        this.id = null;
        this.name = null;
        this.email = null;
    };
    
    createScript(attributes) {
        if (attributes.id && document.getElementById(attributes.id)) return; // script already added
        let newScript = document.createElement("SCRIPT");
        for (let key in attributes) {
            newScript[key] = attributes[key];
        }
        document.body.appendChild(newScript);
    }
    
    facebook(appId) {
        return new Promise(waitForFB => {
            window.fbAsyncInit = () => {
                FB.init({
                    appId: appId,
                    cookie: true,
                    xfbml: true,
                    version: "v6.0"
                });

                FB.AppEvents.logPageView();
                
                FB.login(response => {
                    // handle the response
                    if (response.status === "connected") {
                        // logged into the recipe book page and Facebook
                        FB.api("/me", {fields: "id, name, email"}, response => {
                            this.id = response.id;
                            this.name = response.name;
                            this.email = response.email;
                            waitForFB(this);
                        });
                    } else {
                        // The person is not logged into my webpage or we are unable to tell.
                    }
                }, {scope: "email"});
            };
            
            this.createScript({
                id: "facebook-jssdk",
                src: "https://connect.facebook.net/en_US/sdk.js"
            });
        });
    }

    fireBase(firebaseConfig) {
        return new Promise(waitForUserInfo => {
            const initProvider = () => {
                const provider = new firebase.auth[firebaseConfig.provider]();
                firebase.auth().signInWithPopup(provider).then(result => {
    //                const token = result.credential.accessToken;
    //                const secret = result.credential.secret;
                    // The signed-in user info.
                    const user = result.user;
                    this.name = user.displayName;
                    this.email = user.email || result.additionalUserInfo.profile.email;
                    this.id = user.uid;
                    waitForUserInfo(this);
                }).catch(function(error) {
                    console.log("error: ", error);
                    console.log("error: ", error.message);
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    const credential = error.credential;
                    // ...
                });
            };
            
            if (!(document.getElementById("firebase-jssdk"))) {
                
                const initializeFireBaze = () => {
                    firebase.initializeApp(firebaseConfig);
                    initProvider();
                };
                
                this.createScript({
                    id: "firebase-jssdk",
                    src: "https://www.gstatic.com/firebasejs/7.14.0/firebase-app.js",
                    defer: "defer"
                });
                
                document.getElementById("firebase-jssdk").addEventListener("load", () => {
                    this.createScript({
                        id: "firebase-auth",
                        src: "https://www.gstatic.com/firebasejs/7.14.0/firebase-auth.js",
                        defer: "defer"
                    });
                    document.getElementById("firebase-auth").addEventListener("load", initializeFireBaze);
                });
            } else {
                initProvider();
            }
        });
    }
    
    twitter(firebaseConfig) {
        firebaseConfig.provider = "TwitterAuthProvider";
        return this.fireBase(firebaseConfig);
    }
    
    google(firebaseConfig) {
        firebaseConfig.provider = "GoogleAuthProvider";
        return this.fireBase(firebaseConfig);
    }
}
