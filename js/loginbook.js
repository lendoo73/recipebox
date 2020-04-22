"use strict";

export const createLoginBook = props => {
    const {
        FlipBook,
        Validate,
        callAJAX,
        Social
    } = props;
    const signInBook = new FlipBook("#loginBook"),
          validateInput = new Validate(),
          dom = {
              login: document.getElementById("login"),
              register: document.getElementById("register")
          },
          coverContent = `
            <div>
                <div class="rounded-border" >
                    <img id="loginCover" src="image/login.png" />
                </div>
                <h1>What shall I cook?</h1>
            </div>
        `;
    ;
    // -------------------- Functions --------------------
    const singleValidity = elem => {
        elem.classList.remove("validInput");
        if (!(validateInput.error) && 
            validateInput.signUpPasswordVal && 
            validateInput.repeatPasswordVal) {
            console.log
            validateInput.confirmPassword(dom.signUpPassword.value, dom.repeatPassword.value);
            elem.classList.add("validInput"); // add valid class before elem will be changed!
            if (validateInput.error) elem = dom.repeatPassword;
        }
        validateInput.removeMessageElement(elem.parentElement.children[1]);
        if (validateInput.error) {
            const errorElem = validateInput.createMessageElement("P", validateInput.error, elem.parentElement);
            if (errorElem.innerText === "Repeat Password not confirmed.") {
                // add eye to see wrong password
                errorElem.innerHTML += `<span style="float: right; transform: scale(2); margin-top: -4px;">&#128065;</span>`;
                errorElem.firstElementChild.addEventListener("mouseover", () => {
                    dom.repeatPassword.type = "text";
                    dom.signUpPassword.type = "text";
                    
                });
                errorElem.firstElementChild.addEventListener("mouseout", () => {
                    dom.repeatPassword.type = "password";
                    dom.signUpPassword.type = "password";
                });
            }
            errorElem.style.cssText = `
                font-size: 12px;
                color: red;
                margin-top: 0px;
            `;
        } else {
            elem.classList.add("validInput");
        }
    };
    
    const finalValidity = (id) => {
        if ((id === "repeatPassword" || id === "signUpPassword") &&
             validateInput.signUpPasswordVal && validateInput.repeatPasswordVal) {
            validateInput.confirmPassword(dom.signUpPassword.value, dom.repeatPassword.value);
            singleValidity(dom.repeatPassword);
        }
        const isValidAll = (array, button) => {
            if (validateInput.checkValidity(...array)) {
                button.classList.remove("invalidButton");
                button.classList.add("validButton");
                button.addEventListener("click", submit[button.id]);
            } else {
                button.classList.remove("validButton");
                button.classList.add("invalidButton");
                button.removeEventListener("click", submit[button.id]);
            }
        };
        
        if (id === "loginName" ||
            id === "loginPassword") {
            // login final validation:
            isValidAll(["loginNameVal", "loginPasswordVal"], dom.loginButton);
        } else {
            isValidAll(["signUpNameVal", "emailVal", "signUpPasswordVal", "repeatPasswordVal", "passwordConfirmed"], dom.signUpButton);
        }
//        console.log(validateInput);
    };
    
    const focusForInput = elem => {
        elem.addEventListener("keyup", keyUpForInput);
        elem.addEventListener("blur", blurForInput);
    };
    
    const blurForInput = () => {
        const input = event.target.id,
              elem = document.getElementById(input)
        ;
        singleValidity(dom[input]);
        elem.removeEventListener("keyup", keyUpForInput);
        elem.removeEventListener("blur", blurForInput);
    };
    
    const keyUpForInput = () => {
        const id = event.target.id;
        const value = event.target.value;
        checkInput(id, value);
    };
    
    const checkInput = (id, value) => {
        if (validateInput[id](value)) {
            // input valid:
            dom[id].classList.add("validInput");
            validateInput.removeMessageElement(dom[id].parentElement.children[1]); // remove error message
            finalValidity(id);
        } else {
            // input invalid:
            dom[id].classList.remove("validInput");
            const button = id === "loginName" || id === "loginPassword" 
                ? "loginButton"
            : "signUpButton";
            dom[button].classList.add("invalidButton");
            dom[button].classList.remove("validButton");
            dom[button].removeEventListener("click", submit[button]); // remove click event from the submit button
        }
    };
    
    let socialId = {};
    
    const submit = {
        loginButton: () => {
            console.log("login submitted");
        },
        signUpButton: () => {
            console.log("signup submitted");
            
            const data = {
                username: dom.signUpName.value,
                email: dom.email.value,
                password: dom.signUpPassword.value,
                socialId: socialId
            }
            
            const AJAXProps = {
                url: "php/signup.php",
                header: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                data: `data=${JSON.stringify(data)}`,
                type: "text",
                method: "POST"
            };
//            console.log(AJAXProps.data);
            callAJAX(AJAXProps).then(response => {
                console.log("response", response); 
//                console.log("response", JSON.parse(response)); 
            });
        }
    };
    
    let content;
    
    signInBook.createBook({
        page: 4,
        width: "40vw",
        height: "80vh"
    });

    signInBook.addContent("cover", coverContent);

    // page 1:
    content = `
        <div class="loginContainer">
            <h2>Login with Social Media</h2>
            <div>
                <p><a href="#" id="loginFacebook" class="fb btn">Login with Facebook</a></p>
                <p><a href="#" id="loginTwitter" class="twitter btn">Login with Twitter</a></p>
                <p><a href="#" id="loginGoogle" class="google btn">Login with Google+</a></p>
            </div>
        </div>
    `;

    signInBook.addContent(1, content);
    signInBook.stylePage(1, {
        backgroundColor: "#f2f2f2"
    });
    
    

    // page 2:
    content = `
        <div class="loginContainer">
            <h2>Login Manually</h2>
            <div id="formContainer">
                <p><input type="text" id="loginName" name="loginName" placeholder="Username" required="required" /></p>
                <p><input type="password" id="loginPassword" name="loginPassword" placeholder="Password" required="required" /></p>
                <p><input type="submit" id="loginButton" value="Login" /></p>
            </div>
            <p id="forgotPassword">Forgot password?</p>
        </div>
    `;

    signInBook.addContent(2, content);
    signInBook.stylePage(2, {
        backgroundColor: "beige"
    });
    signInBook.getContentContainer(2).nextElementSibling.innerHTML = "Sign Up";

    // page 3, sign up:
    content = `
        <div class="signUpWithSocial">
            <h2>Sign Up with Social</h2>
            <div>
                <p id="signupFacebook"><img src="icons/facebook.png" alt="facebook icon" /></p>
                <p id="signupTwitter"><img id="twitterIcon" src="icons/twitter.png" alt="twitter icon" /></p>
                <p id="signupGoogle"><img src="icons/google.svg" alt="google+ icon" /></p>
            </div>
        </div>
    `;

    signInBook.addContent(3, content);
    signInBook.stylePage(3, {
        backgroundColor: "gold"
    });
    signInBook.getContentContainer(3).nextElementSibling.innerHTML = "Login";

    // page 4, sign up:
    content = `
        <div class="registrationContainer">
            <h2>Create an account</h2>
            <div id="formContainer">
                <label for="signUpName">Username</label>
                <p><input type="text" id="signUpName" name="signUpName" placeholder="Username" required="required" /></p>
                <label for="email">Email</label>
                <p><input type="email" id="email" name="email" placeholder="Enter Email" required="required" /></p>
                <label for="signUpPassword">Password</label>
                <p><input type="password" id="signUpPassword" name="signUpPassword" placeholder="Enter Password" required="required" /></p>
                <label for="repeatPassword">Repeat Password</label>
                <p><input type="password" id="repeatPassword" name="repeatPassword" placeholder="Repeat Password" required="required" /></p>
                <p><input type="submit" id="signUpButton" value="Register" /></p>
            </div>
        </div>
    `;

    signInBook.addContent(4, content);
    signInBook.stylePage(4, {
        backgroundColor: "#e0f7e1"
    });

    dom.loginButton = document.getElementById("loginButton");
    dom.signUpButton = document.getElementById("signUpButton");
    dom.loginButton.classList.add("invalidButton");
    dom.signUpButton.classList.add("invalidButton");
    
    // Add click event to the right menu
    dom.login.addEventListener("click", () => {
        signInBook.openAt(2);
    });
    dom.register.addEventListener("click", () => {
        signInBook.openAt(4);
    });
    
    // add event listeners to the user inputs:
    ["loginName", "loginPassword", "signUpName", "email", "signUpPassword", "repeatPassword"].forEach(id => {
        dom[id] = document.getElementById(id);
        dom[id].addEventListener("focus", () => focusForInput(dom[id]));
    });
    
    // add event listeners to the social signup buttons:
    
    const addNameFromSocial = name => {
        dom.signUpName.value = name;
        checkInput("signUpName", name);
    };
    
    const addEmailFromSocial = email => {
        dom.email.value = email;
        checkInput("email", email);
    };
    const deleteAllKeyFromObj = obj => {
        for (let key in obj) {
            delete obj[key];
        }
        return obj;
    };
    // facebook:
    dom.signupFacebook = document.getElementById("signupFacebook");
    dom.signupFacebook.addEventListener("click", () => {
        const signup = new Social();
        signup.facebook(app id goes here).then(data => {
            addNameFromSocial(data.name);
            addEmailFromSocial(data.email);
            deleteAllKeyFromObj(socialId);
            socialId.facebook = data.id;
        });
    });
    
    const firebaseConfig = {
        apiKey: "api key goes here",
        authDomain: "my-recipe-book-1586110176619.firebaseapp.com",
        databaseURL: "https://my-recipe-book-1586110176619.firebaseio.com",
        projectId: "my-recipe-book-1586110176619",
        storageBucket: "my-recipe-book-1586110176619.appspot.com",
        messagingSenderId: "538531747473",
        appId: "1:538531747473:web:32e81082ee25143f8b1130"
    };
    // twitter:
    dom.signupTwitter = document.getElementById("signupTwitter");
    dom.signupTwitter.addEventListener("click", () => {
        const signup = new Social();
        signup.twitter(firebaseConfig).then(data => {
            addNameFromSocial(data.name);
            if (data.email) addEmailFromSocial(data.email);
            deleteAllKeyFromObj(socialId);
            socialId.twitter = data.id;
        });
    });
    
    // google:
    dom.signupGoogle = document.getElementById("signupGoogle");
    dom.signupGoogle.addEventListener("click", () => {
        const signup = new Social();
        signup.google(firebaseConfig).then(data => {
            addNameFromSocial(data.name);
            if (data.email) addEmailFromSocial(data.email);
            deleteAllKeyFromObj(socialId);
            socialId.google = data.id;
        });
    });
    
    return signInBook;
};
