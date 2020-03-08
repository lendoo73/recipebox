"use strict";
// ----------------------------- footer: -----------------------------
export const updateFooter = () => {
    const developed = document.getElementById("developed");
    const presentYear = document.getElementById("presentYear");
    const present = new Date;
    const year = present.getFullYear();
    if (year > developed.innerHTML) {
        presentYear.innerHTML = `-${year}.`;
    }
};