"use strict";
export const createLoginBook = props => {
    const {
        FlipBook,
        Validate
    } = props;
    const signInBook = new FlipBook("#loginBook"),
          validateInput = new Validate(),
          dom = {
              login: document.getElementById("login"),
              register: document.getElementById("register"),
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
        validateInput.removeMessageElement(elem.parentElement.children[1]);
        if (validateInput.error) {
            const errorElem = validateInput.createMessageElement("P", validateInput.error, elem.parentElement);
            errorElem.style.cssText = `
                font-size: 12px;
                color: red;
                margin-top: 0px;
            `;
        } else {
            elem.classList.add("validInput");
        }
    };
    
    const finalValidity = () => {
        if (validateInput.checkValidity("usernameVal", "loginPasswordVal")) {
            dom.loginButton.classList.remove("invalidButton");
            dom.loginButton.classList.add("validButton");
        } else {
            dom.loginButton.classList.remove("validButton");
            dom.loginButton.classList.add("invalidButton");
        }
    };
    
    const focusForInput = elem => {
        elem.addEventListener("keyup", keyUpForInput);
        elem.addEventListener("blur", blurForInput);
    };
    
    const blurForInput = () => {
        const input = event.target.id,
              elem = document.getElementById(input)
        ;
        userInput[input] = validateInput[input](event.target.value);
        singleValidity(dom[input]);
        elem.removeEventListener("keyup", keyUpForInput);
        elem.removeEventListener("blur", blurForInput);
        console.log(validateInput);
    };
    
    const keyUpForInput = () => {
        const elem = event.target.id;
//        console.log(elem);
//        console.log("keyup validity", Boolean(validateInput[elem](event.target.value)));
        if (validateInput[elem](event.target.value)) {
            dom[elem].classList.add("validInput");
            finalValidity();
        } else {
            dom[elem].classList.remove("validInput");
            dom.loginButton.classList.remove("validButton");
            dom.loginButton.classList.add("invalidButton");
        }
    };
    
    signInBook.executable = () => {
        
        const timeOut = callback => {
            setTimeout(() => {
                callback();
            }, 100);
        };
        
        if (event) {
            let page;
            if (event.target.className === "next-btn") {
                page = event.target.parentElement;
                timeOut(() => page.classList.add("hide"));
            } else if (event.target.className === "back") {
                // bugfix when open from back
                page = event.target.parentElement.firstElementChild;
                timeOut(() => page.classList.remove("hide"));
            } else {
                page = event.target.parentElement.offsetParent.firstElementChild;
                timeOut(() => page.classList.remove("hide"));
            }
        }
    };
    
    let userInput = {
        username: null,
        password: null
    }, content
    ;
    
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
                <p><a href="#" class="fb btn">Login with Facebook</a></p>
                <p><a href="#" class="twitter btn">Login with Twitter</a></p>
                <p><a href="#" class="google btn">Login with Google+</a></p>
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
                <p><input type="text" id="username" name="username" placeholder="Username" required="required" /></p>
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
    dom.loginContainerManually = document.querySelectorAll(".loginContainer")[1];

    // page 3, sign up:
    content = `
        <div class="signUpWithSocial">
            <h2>Sign Up with Social</h2>
            <div>
                <p><img src="../icons/facebook.png" alt="facebook icon" /></p>
                <p><img id="twitterIcon" src="../icons/twitter.png" alt="twitter icon" /></p>
                <p><img src="../icons/google.svg" alt="google+ icon" /></p>
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
                <label for="email">Email</label>
                <p><input type="email" id="email" name="email" placeholder="Enter Email" required="required" /></p>
                <label for="password">Password</label>
                <p><input type="password" name="password" placeholder="Enter Password" required="required" /></p>
                <label for="repeatPassword">Repeat Password</label>
                <p><input type="password" name="repeatPassword" placeholder="Repeat Password" required="required" /></p>
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
        dom.loginContainerManually.classList.remove("hide");
        signInBook.openAt(2);
    });
    dom.register.addEventListener("click", () => {
        signInBook.openAt(4);
    });

    // validate login input:
    dom.username = document.getElementById("username");
    dom.username.addEventListener("focus", () => {
        focusForInput(dom.username);
    });

    dom.loginPassword = document.getElementById("loginPassword");
    dom.loginPassword.addEventListener("focus",  () => {
        focusForInput(dom.loginPassword);
    });
    
    
    
    // validate sign up input:
    // validate email:
    dom.email = document.getElementById("email");
    dom.email.addEventListener("focus", () => {
        focusForInput(dom.email);
    });
    
    return signInBook;
};
