"use strict";

const setDom = () => {
    return {  
        allRecipes: document.querySelectorAll("#searchResultContainer > div"), // the recipes cards
        everyWhereContainer: document.getElementById("everyWhereContainer"),
        otherOptionContainer: document.getElementById("otherOptionContainer"),
        everyWhere: document.getElementById("everyWhere"),
        inName: document.getElementById("inName"),
        inIngredients: document.getElementById("inIngredients"),
        inDirections: document.getElementById("inDirections"),
        inputField: document.getElementById("searchInput")
    };
};

const show = elem => {
    elem.classList.remove("hide");
};

const hide = elem => {
    elem.classList.add("hide");
};

const inputSize = size => {
    document.getElementById("searchInput").style.width = size;
};

const sanitizeInput = string => {
    return string.trim().replace(/\s+(?=\s)/g, "").toLowerCase();
};

export const toogleSearchField = recipes => {
    
    const dom = setDom();
    
    let searchInput = "";
    
    dom.inputField = document.getElementById("searchInput");
    dom.filterContainer = document.getElementById("filterContainer");
    
    const keyUpEvent = () => {
//        console.log("keyup event triggerd");
        dom.inputField.dataset.keyup = "true";
        searchInput = event.target.value;
        filterCards();
    };
    
    const changeSelect = () => {
        const dom = setDom();
        if (event.target.value === "everyWhere") {
            // show the other 3 option:
            show(dom.otherOptionContainer);
            dom.inName.checked = true;
            // hide everywhere:
            hide(dom.everyWhereContainer);
            dom.inputField.focus();
        } else if (dom.inName.checked &&
                   dom.inIngredients.checked &&
                   dom.inDirections.checked) {
            // everything selected, show everywhere:
            show(dom.everyWhereContainer);
            dom.everyWhere.checked = true;
            // hide the other 3 option:
            hide(dom.otherOptionContainer);
            dom.inIngredients.checked = false;
            dom.inDirections.checked = false;
            dom.inputField.focus();
        } else if (!(dom.inName.checked) &&
                   !(dom.inIngredients.checked) &&
                   !(dom.inDirections.checked)) {   
            // nothing selected, close searchField:
            hide(dom.otherOptionContainer);
            toogleSearchField();
        } else {
            // any one or two selected: stay in focus the input field
            dom.inputField.focus();
        }
        filterCards();
    };
    
    const filterCards = () => {
        // resize inputfield:
        const width = document.getElementById("searchInput").style.width;
        if (searchInput.length + 4 > (+ width.slice(0, width.length - 2))) {
            inputSize(`${searchInput.length + 4}ch`);
        }
        const dom = setDom(),
              userInput = sanitizeInput(searchInput)
        ;
        if (!(userInput)) return;
        if (dom.everyWhere.checked) {
            // search everywhere:
            dom.allRecipes.forEach((recipeCard, index) => {
                show(recipeCard);
                const cardName = sanitizeInput(recipeCard.textContent);
                if (!(filterString(cardName, userInput))) {
                    // name does not match, check in ingredients:
                    if (!(recipes[index].content.ingredients.some(ingredient => filterString(sanitizeInput(ingredient[2]), userInput)))) {
                        // in ingredients does not mach, check in directions:
                        if (!(recipes[index].content.directions.some(direction => filterString(sanitizeInput(direction), userInput)))) {
                            // nowhere found match, hide ticket:
                            hide(recipeCard);
                        }
                    }
                }
            });
        } else {
            dom.allRecipes.forEach((recipeCard, index) => {
                show(recipeCard);
                const cardName = sanitizeInput(recipeCard.textContent);
                if (dom.inName.checked) {
                    if (!(filterString(cardName, userInput))) {
                        // name does not match, hide this ticket:
                        hide(recipeCard);
                    }   
                } else hide(recipeCard);
                if (dom.inIngredients.checked) {
                    const result = recipes[index].content.ingredients.some(ingredient => filterString(sanitizeInput(ingredient[2]), userInput));
                    if (result) show(recipeCard);
                }
                if (dom.inDirections.checked) {
                    if (recipes[index].content.directions.some(direction => filterString(sanitizeInput(direction), userInput))) show(recipeCard);
                }
            });
        }
    };
    
    if (!(+ dom.inputField.style.opacity)) {
        show(dom.everyWhereContainer);
        inputSize("10ch");
        dom.inputField.style.opacity = 1;
        dom.inputField.style.display = "inline";
        dom.inputField.focus();
        if (dom.inputField.dataset.keyup === "false") {
            // to avoid setup multiple times keyup event
            dom.inputField.addEventListener("keyup", keyUpEvent);
        }
        dom.filterContainer.addEventListener("change", changeSelect);
    } else {
        hide(dom.everyWhereContainer);
        hide(dom.otherOptionContainer);
        dom.everyWhere.checked = true;
        dom.inputField.style.width = "0px";
        dom.inputField.style.opacity = 0;
        dom.inputField.style.display = "none";
    }
};
const filterString = (string, filter) => {
    console.log()
    return string.indexOf(filter) > -1; 
};