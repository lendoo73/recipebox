"use strict";

class Validate {
    constructor() {
        this.error = null;
        this.usernameVal = false;
        this.loginPasswordVal = false;
        this.emailVal = false;
    }
    
    username(name, length = 1) {
        this.error = null;
        name = this.trimInput(name);
        if (name.length < length) {
            this.usernameVal = false;
            this.error = "Username too short.";
            return null;
        }
        this.usernameVal = true;
        return name;
    }
    
    loginPassword(password, length = 6, digit = false) {
        this.error = null;
        password = this.trimInput(password);
        const passwordLength = password.length;
        if (passwordLength < length) {
            this.loginPasswordVal = false;
            this.error = `Password too short. (${length - passwordLength} character${length - passwordLength > 1 ? "s" : " "} need more.)`;
            return null;
        }
        if (digit) {
//            console.log("check digit");
        }
        this.loginPasswordVal = true;
        return password;
    }
    
    email(email) {
        this.error = null;
        email = this.trimInput(email);
//        console.log("email", email);
        if (email.length === 0) {
            this.error = `Email empty :(`;
            return null;
        }
        
        let localPart = email.split("@"),
            domainPart = localPart.pop(),
            result,
            regEx,
            octet, // IPv4 address portion
            answer
        ;
        
        const removeComment = part => {
            // remove comment from the begining of part:
            if (part[0] === "(" ||
                part[part.length - 1] === ")") {
                part = part.replace(/\(.*\)/, "");
            }
            return part;
        };
        
//        console.log("localPart", localPart);
        
        if (domainPart === email) {
            this.error = `@ missing from the address.`;
            return null;
        }
        
        // validate domain part:
        if (domainPart.length === 0) {
            this.error = `Domain missing from the end...`;
            return null;
        }
        if (domainPart.length > 253) {
            this.error = `The Domain part is too long.`;
            return null;
        }
        
        // check domain part comment:
        domainPart = removeComment(domainPart);
        
        if (/^\[.*\]$/.test(domainPart)) {
            const ip = domainPart.replace(/^\[/, "").replace(/\]$/, "");
            // IP address domain:
            const validateOctet = octet => {
                octet = octet.trim();
                if (/[^0-9]/.test(octet) || octet.length === 0) return false;
                console.log(octet, octet >= 0 && octet < 256);
                return octet >= 0 && octet < 256;
            }
            if (/:/.test(ip)) {
                if (/\./.test(ip)) {
                    // IPv6 dual address combined with IPv4: y:y:y:y:y:y:x.x.x.x.
                    // lendoo73@[2001 : db8: 3333 : 4444 : 5555 : 6666 : 1 . 2 . 3 . 4]
                    console.log("IPv6 dual literal domain");
                    // check IPv6 portion:
                    const ipv6Portion = ip.slice(0, ip.lastIndexOf(":"));
                    const segments = ipv6Portion.split(":");
                    if (segments.length < 2) {
                        this.error = `Too few segments in domain part`;
                        return null;
                    }
                    if (segments.length < 6) {
                        // search for short form of segment
                        let segmentShortForm = false;
                        for (let i = 0; i < segments.length; i ++) {
                            if (!(segments[i].length)) {
                                segmentShortForm = true;
                            }
                        }
                        if (!(segmentShortForm)) {   
                            this.error = `Too few segments in domain part`;
                            return null;
                        }
                    }
                    if (segments.length > 6) {
                        this.error = `Too many segments in domain part`;
                        return null;
                    }
                    // check if the segment in valid format
                    regEx = /[^a-f0-9]/gi;
                    for (let i = 0; i < segments.length; i ++) {
                        const segment = segments[i].trim();
                        if (segment.length) {
                            if (segment.length > 4) {
                                this.error = `Invalid segment format: ${segment}`;
                                return null;
                            }
                            result = segment.match(regEx);
                            if (result) {
                                this.error = `Only hexadecimal number alloved in segment: ${segment}`;
                                return null;
                            }
                        }
                    }
                    
                    // check IPv4 portion:
                    const ipv4Portion = ip.slice(ip.lastIndexOf(":") + 1);
                    console.log("ipv4Portion", ipv4Portion);
                    const octets = ipv4Portion.split(".");
                    if (octets.length !== 4) {
                        this.error = `Invalid IPv4 address in the Domain part.`;
                        return null;
                    }
                    for (let i = 0; i < octets.length; i ++) {
                        if (!(validateOctet(octets[i]))) {
                            this.error = `Invalid octet in the IPv4 part of address: ${octets[i]}`;
                            return null;
                        }
                    }
                    
                } else {
                    // IPv6 normal address literal domain (y:y:y:y:y:y:y:y: where y = 0-FFFF):
                    console.log("IPv6 normal literal domain");
                }
            } else {
                // IPv4 ip address literal domain (x.x.x.x where x = 0-255):
                const ipv4 = domainPart.replace(/^\[/, "").replace(/\]$/, "").split(".");
                if (ipv4.length !== 4) {
                    this.error = `Invalid IP address in the Domain part.`;
                    return null;
                }
                for (let i = 0; i < ipv4.length; i ++) {
                    octet = + ipv4[i];
                    if (!(validateOctet(octet))) {
                        this.error = `Invalid octet in the IP address (Domain part): ${octets[i]}`;
                        return null;
                    }
                }
            }
        } else {
            // named domain:
//            console.log(domainPart);
            const labels = domainPart.split(".");
            const labelsLength = labels.length;

            if (labels[0] === domainPart) {
                // domain part withouth dot (iamadmin@mailserver2)
            }

            // validate labels of domain part: 
            regEx = /[^a-zA-Z0-9-]/g;
            for (let i = 0, length = labels.length; i < length; i ++) {
//                console.log("labels", labels[i]);
                const currLabel = labels[i],
                      currLabelLength = currLabel.length;
                if (i === 0 && currLabelLength === 0) {
                    this.error = `Domain part cannont to start with dot character.`;
                    return null;
                }
                if (i === length - 1) {
                    // check the last label:
                    if (currLabelLength === 0) {
                        this.error = `Domain part cannont to finish with dot character.`;
                        return null;
                    }
                    if (currLabelLength < 2) {
                        this.error = `${currLabel}: is not a valid tld `;
                        return null;
                    }
                    if (currLabel[currLabelLength - 1] === "-") {
                        this.error = `${currLabel}: the last character cannot to be hyphen. ( - )`;
                        return null;
                    }
                }
                if (currLabelLength === 0) {
                    this.error = `Double dots in the domain part but it is not allowed.`;
                    return null;
                }
                if (currLabelLength > 63) {
                    this.error = `Label ${i + 1} is too long.`;
                    return null;
                }
                if (currLabel[0] === "-") {
                    this.error = `${currLabel} cannot to start with hyphen.`;
                    return null;
                }
                result = currLabel.match(regEx);
                if (result) {
                    answer = result.length > 1 
                        ? `s are`
                    : ` is`;
                    this.error = `Invalid character${answer} in the ${currLabel} label: ${result.join(" ")}`;
                    return null;
                }
            }
        }
        
        // domain part valid, check local part:
        const validateQuotedPart = quotedPart => {
            // quoted email:
            quotedPart = quotedPart.replace(/(^")|("$)/g, ""); // remove qouotes from the begining and from the end
//            console.log("qouted email:", email);
            let regEx = /[^ -~]/g; // search non-ASCII characters
            result = quotedPart.match(regEx); 
            if (result) {
                // non-ASCII character(s) found:
                answer = result.length > 1 
                    ? `s are`
                : ` is`;
                this.error = `Invalid character${answer} in the local parts before @: ${result.join(" ")}`;
                return false;
            } else {
                // only ASCII charaters are in the qouoted part:
                // search non-escaped whitespace characters, double quotes and backslashes:
                regEx = /[\s\\"]/g;
                result = quotedPart.match(regEx);
                if (result) {
                    const cleanQuotedPart = (dirty, replaceString) => {
                        let clean = dirty.replace(replaceString, "");
                        if (clean !== dirty) clean = cleanQuotedPart(clean, replaceString);
                        return clean;
                    };
                    // whitespace characters, double quotes or backslashes found; check if are backslashes
                    let cleanPart = quotedPart;
                    result.forEach(isEscaped => {
                        const replaceString = `\\${isEscaped}`;
                        cleanPart = cleanQuotedPart(cleanPart, replaceString);
                    });
                    if (!(result.every(isEscaped => {
                        if (cleanPart.includes(isEscaped)) {
                            this.error = `${isEscaped === "\\" || isEscaped === "\"" 
                                ? isEscaped 
                            : "Whitespace character" } must be escaped with backslashes(\\)`;
                            return false;
                        } else return true;
                    }))) {
                        // non-escaped:
                        return false;
                    } else {
                        // escaped well
                    }
                } else {
                    // not found  whitespace characters, double quotes and backslashes
                }
            }
            
            return true;
        };
        
        const validateLocalPartPortions = portion => {
            let regEx = /[^a-zA-Z0-9!#$%&'*+-/=?^_`{|}\~\.]/g;
            result = portion.match(regEx); 
            if (result) {
                answer = result.length > 1 
                    ? `s are`
                : ` is`;
                this.error = `Invalid character${answer} in the local parts before @: ${result.join(" ")}`;
                return false;
            }
            return true;
        };
        
        regEx = /^".*"{1}$/g;
        if (localPart.length > 1) {
            localPart = localPart.join("@");
        } else localPart = localPart[0];
        // check length:
        if (localPart.length === 0) {
            this.error = `The local part is empty. (before @)`;
            return null;
        }
        if (localPart.length > 64) {
            this.error = `The local part is too long.`;
            return null;
        }
        
        localPart = removeComment(localPart);
        
        if (regEx.test(localPart)) {
            if (!(validateQuotedPart(localPart))) return null;
        } else {
            // unquoted email:
            /* may use: 
                - a-zA-Z
                - 0-9
                - printable characters: !#$%&'*+-/=?^_`{|}~
                - dot (.): provided that it is not the first or last character and provided also that it does not appear consecutively 
            */
            if (/^\./.test(localPart)) {
                this.error = `Email cannot to start with dot (.)`;
                return null;
            }
            if (/\.$/.test(localPart)) {
                this.error = `Email cannot to finish with dot (.)`;
                return null;
            }
            if (localPart.match(/\.\./)) {
                this.error = `Dots cannot appear consecutively (..)`;
                return null;
            }
            
            // validate portions of the local part:
            localPart = localPart.split(".");
            for (let i = 0; i < localPart.length; i ++) {
                if (regEx.test(localPart[i])) {
                    if (!(validateQuotedPart(localPart[i]))) return null;
                } else {
                    if (!(validateLocalPartPortions(localPart[i]))) return null;
                }
            }
        }
        
        this.emailVal = true;
        return email;
    }
    
    trimInput(input) {
        return input.trim().replace(/\s+/g, " ");
    }
    
    createMessageElement(tag, message, parent) {
        const newElement = document.createElement(tag);
        const content = document.createTextNode(message);
        newElement.appendChild(content);
        return parent.appendChild(newElement);
    }
    
    removeMessageElement(element) {
        if (element) element.remove();
    }
    
    checkValidity() {
        return [...arguments].every(arg => this[arg]);
    }
}

export {
    Validate
};