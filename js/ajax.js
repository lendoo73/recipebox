"use strict";

export const callAJAX = (props) => {
    const url = props.url,
          method = props.method || "GET",
          type = props.type || "JSON",
          header = props.header
    ;
    
    return new Promise(waitForResult => {
        const xhttp = new XMLHttpRequest();
        if (method === "GET") {
            xhttp.open("GET", url, true);
            for (const key in header) {
                xhttp.setRequestHeader(key, header[key]);
            }
            xhttp.send();
        } else {
            xhttp.open("POST", url, true);
            for (const key in header) {
                xhttp.setRequestHeader(key, header[key]);
            }
            xhttp.send(props.data);
        }
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
//                console.log(this.response);
                type === "text"
                    ? waitForResult(this.response)
                    : waitForResult(JSON.parse(this.response))
                ;
            }
        };
    });
};