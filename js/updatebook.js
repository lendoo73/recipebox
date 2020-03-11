"use strict";
const header = document.querySelector("body header h2");

export const changeBook = (activeBook, openBook) => {
    if (activeBook !== openBook) {
        const books = {
            loginBook: {
                book: document.getElementById("loginBook"),
                menu: document.querySelector(".loginMenu"),
                headerContent: "Login or sign up"
            },
            recipeBook: {
                book: document.getElementById("recipeBook"),
                menu: document.querySelector(".recipesMenu"),
                headerContent: "All recipes"
            }, 
            newRecipesBook: {
                book: document.getElementById("newRecipesBook"),
                menu: document.querySelector(".recipesMenu"),
                headerContent: "Add new recipes"
            }
        }
        header.innerHTML = books[openBook.container.id].headerContent;
        // hide active book and menu:
        activeBook.container.firstElementChild.style.transform = "translateY(2000px)";
        books[activeBook.container.id].menu.classList.add("hide");

        // show open book:
        setTimeout(() => {
            books[openBook.container.id].book.style.display = "block";
            books[activeBook.container.id].book.style.display = "none";
        }, 50);
        setTimeout(() => {
            if (openBook.opened) {
                openBook.container.firstElementChild.style.transform = `translate(${openBook.openTranslate}, 0)`;
            } else {
                openBook.container.firstElementChild.style.transform = "translateY(0)";
            }
            books[openBook.container.id].menu.classList.remove("hide");
        }, 150);
    } 
    return openBook;
};

//  -----------------------------------    Create recipe    -----------------------------------  
export const createRecipeContent = (name, ingredientsArray, directions, editable = false) => {
    let recipeContent = "", directionsList = "";
    if (editable) {
        recipeContent = `
            <div class="edit-container">
                <div><img class="edit" data-editmode="off" src="icons/edit.svg" title="Edit Recipe" /></div>
                <div><img class="delete" data-deletemode="off" src="icons/delete.png" title="Delete Recipe" /></div>
            </div> 
        `;
    }
    const ingredientsList = createIngredientsList(ingredientsArray);
    directions.forEach((step, index) => {
        directionsList += `<li>${step}</li>`;
    });
    recipeContent += `
        <h1>${name}</h1>
        <h3 class="hide"></h3>
        <h3>Ingredients:</h3>
        <ul>${ingredientsList}</ul>
        <h3>Directions:</h3>
        <ol>${directionsList}</ol>
    `;
    return recipeContent;
};

const createIngredientsList = ingredientsArray => {
    let ingredientsList = "";
    ingredientsArray.forEach(ingredient => {
        ingredientsList += `<li>${ingredient.join(" ")}</li>`;
    });
    return ingredientsList;
}

export const sendAlert = (message, type) => {
    const alertBox = document.getElementById("alertBox");
    alertBox.className = "";
    alertBox.style.display = "block";
    alertBox.innerHTML = message;
    alertBox.classList.add(type);
    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
};
    

//  -----------------------------------    Edit recipe    -----------------------------------  
export const editRecipe = (recipes, recipeIndex) => {
//    console.log(event);
    const dom = {
        body: document.querySelector("body"),
        headerContainer: document.querySelector("header")
    };
    
    const currentRecipe = recipes[recipeIndex];
    
    // browser compatibility issue: firefox not support event.path
    const rightPage = event.target.parentElement.parentElement.parentElement.parentElement.parentElement,
          rightInnerContaniner = event.target.parentElement.parentElement.parentElement.parentElement,
          rightContentContainer = event.target.offsetParent.parentElement,
          editContainer = event.target.parentElement.parentElement
    ;
    const bgColor = rightInnerContaniner.style.backgroundColor,
          textColor = rightContentContainer.style.color || "black",
          editIcon = event.target,
          deletetIconContainer = event.target.offsetParent.lastElementChild,
          modalHack = document.querySelector(".modalHack"),
          nextButton = rightInnerContaniner.children[1],
          backButton = rightPage.previousElementSibling.children[1].children[1],
          recipeName = rightContentContainer.children[1],
          selectCategory = rightContentContainer.children[2],
          ingredients = rightContentContainer.children[4],
          directions = rightContentContainer.children[5],
          leftSideContent = rightPage.previousElementSibling.children[1].children[0]
    ;
    
    const closeEditMode = () => {
        if (event.target === editContainer || 
            event.target === document.querySelector(".modalHack")) {
            // simulate click event on edit icon:
            editIcon.click();
        }
    };
    
    // remove any html tags and spaces:
    const sanitizeInput = input => {
        return input.replace(/\s+(?=\s)|&nbsp;|<\/?[\w\s="/.':;#-\/]+>|&lt;\/?[\w\s="/.':;#-\/]+&gt;/gi, "").trim();
    };
    
    //  -----------------------------------    Edit name    -----------------------------------  
    const changeName = () => {
//        console.log(event.target.innerText);
        const updated = sanitizeInput(event.target.innerText);
        if (updated !== currentRecipe.name) {
            if (updated) {
                currentRecipe.name = updated;
                refreshStorage(currentRecipe);
                event.target.innerText = updated;
                header.textContent = "The name has been changed.";
            } else {
                event.target.innerText = currentRecipe.name;
                sendAlert("The name cannot be left blank!", "warning");
            }
        } 
    };
    
    //  -----------------------------------    Edit category    -----------------------------------  
    const categorySelector = () => {
        // show categories:
        selectCategory.innerHTML = `
            <label for="category">Category: </label>
            <select id="category">
                <option value="bakery">Bakery</option>
                <option value="salads">Salads, Dressings...</option>
                <option value="soups">Soups, Stews & Chili</option>
                <option value="mainDishes">Main dishes</option>
                <option value="desserts">Desserts</option>
            </select>
        `;
        const currentCategory = currentRecipe.category;
        dom.category = document.getElementById("category");
        document.querySelector(`#category > [value=${currentCategory}]`).setAttribute("selected", "selected");
        // add event listener to the category selector:
        dom.category.addEventListener("change", () => {
//            console.log(event);
            currentRecipe.category = event.target.value;
            refreshStorage(currentRecipe);
            refreshCategoryShadow(currentRecipe);
        });
    };
    
    //  -----------------------------------    Edit ingredients    -----------------------------------  
    const ingredientsArray = currentRecipe.content.ingredients;
    const ingredientsTable = () => {
        let rows = "";
        ingredientsArray.forEach((indgredients, tableRow) => {
            let td = "";
            indgredients.forEach((data, tableColumn) => {
                td += `<td contenteditable="true" data-row="${tableRow}" data-column="${tableColumn}">${data}</td>`;
            });
            rows += `<tr>${td}<td class="delete-ingredient-row" data-row="${tableRow}">&times;</td></tr>`;
            
        });
        const table = `
            <table class="editable">
                <tr>
                    <th>Qty.</th>
                    <th>Unit</th>
                    <th>Name</th>
                </tr>
                ${rows}
                <tr>
                    <td contenteditable="true" data-row="${ingredientsArray.length}" data-column="${0}"></td>
                    <td contenteditable="true" data-row="${ingredientsArray.length}" data-column="${1}"></td>
                    <td contenteditable="true" data-row="${ingredientsArray.length}" data-column="${2}"></td>
                </tr>
            </table>
        `;
        ingredients.innerHTML = table;
        
        // add events to the table:
        dom.tdAll = document.querySelectorAll("[id^=content] ul table td");
        dom.trAll = document.querySelectorAll("[id^=content] ul table tr");
        dom.editable = document.querySelectorAll(".editable");
        dom.tdAll.forEach((cell, index) => {
            if ((index + 1) % 4 === 0) {
                // these cells are the delete buttons:
                cell.addEventListener("click", deleteIngredients);
                cell.addEventListener("mouseover", hoverDeleteIngredients);
                cell.addEventListener("mouseout", hoverDeleteIngredients);
            } else {
                cell.addEventListener("mousedown", grabIngredientsRow);
                cell.addEventListener("mouseup", dropIngredientsRow);
            }
        });
    };
    
    const changeIngredients = () => {
        event.target.removeEventListener("blur", changeIngredients);
        const target = event.target; 
        const row = + target.dataset.row;
        const column = + target.dataset.column;
        
        // remove the focus style from the cell:
        event.target.style.border = "1px solid black";
        event.target.classList.remove("move-ingredient-row");
        
        if (column === 2 && target.textContent === "") {
            if (row < ingredientsArray.length) {
                target.textContent = "Ingredient's name cannot to be empty.";
                setTimeout(() => {
                    target.textContent = ingredientsArray[row][column];
                }, 3000);
            }
            return;
        }
            
        const updated = sanitizeInput(target.textContent);
        if (row === ingredientsArray.length) {
            if (column === 2) {
                // new ingredient name added to the list:
                const quantity = sanitizeInput(target.previousElementSibling.previousElementSibling.textContent);
                const unit = sanitizeInput(target.previousElementSibling.textContent);
                const ingredient = sanitizeInput(target.textContent);
                ingredientsArray.push([quantity, unit, ingredient]);
                // refresh table:
                ingredientsTable();
                refreshStorage(currentRecipe);
            }
        } else if (updated !== ingredientsArray[row][column]) {
            ingredientsArray[row][column] = updated;
            refreshStorage(currentRecipe);
        }
    };
    
    const hoverDeleteIngredients = () => {
        dom.headerContainer.classList.toggle("delete-mode-on");
        if (event.type === "mouseover") {
            header.textContent = "Are you sure You want to DELETE this row?";
        } else {
            header.textContent = "Edite mode: ON";
        }
    };
    
    const deleteIngredients = () => {
//        console.log(event);
        const row = event.target.dataset.row;
        ingredientsArray.splice(row, 1);
        refreshStorage(currentRecipe);
        // refresh table:
        ingredientsTable();
        header.textContent = "Edite mode: ON";
        dom.headerContainer.classList.toggle("delete-mode-on");
    };
    
    let previousRow, hoverRow, dropRow;
    const grabIngredientsRow = () => {
//        console.log("grab", event);
        if (+ event.target.dataset.row === ingredientsArray.length) {
            // this is the last row to add new ingredients:
            return event.target.addEventListener("blur", changeIngredients);
        }
        previousRow = + event.target.dataset.row;
        
        // disable text selection highlighting:
        dom.body.style.userSelect = "none";
        // change cursor style to grabbing:
        dom.editable[1].style.cursor = "grabbing";
        
        // remove other events to avoid collision:
        dom.tdAll.forEach((cell, index) => {
            if ((index + 1) % 4 === 0) {
                // these cells are the delete buttons:
                cell.removeEventListener("click", deleteIngredients);
                cell.removeEventListener("mouseover", hoverDeleteIngredients);
                cell.removeEventListener("mouseout", hoverDeleteIngredients);
            }
        });
        
        // style the grabbed row:
        dom.trAll[previousRow + 1].classList.add("move-ingredient-row");
        // add hover event while grabbed the row:
        dom.trAll.forEach(row => {
            if (row.firstChild.dataset) row.addEventListener("mouseover", moveIngeridientRow);
        });
    };
    
    const moveIngeridientRow = () => {
//        console.log("move event - mouseover", event);
        hoverRow = + event.target.dataset.row;
        
        if (hoverRow < previousRow) {
            // move up the row
            [ingredientsArray[previousRow], ingredientsArray[hoverRow]] = [ingredientsArray[hoverRow], ingredientsArray[previousRow]];
            previousRow = hoverRow;
            ingredientsTable();
            grabIngredientsRow();
        } else if (hoverRow > previousRow) {
            [ingredientsArray[previousRow], ingredientsArray[hoverRow]] = [ingredientsArray[hoverRow], ingredientsArray[previousRow]];
            previousRow = hoverRow;
            ingredientsTable();
            grabIngredientsRow();
        }
    };
    
    const dropIngredientsRow = () => {
//        console.log("drop event", event);
        const lastRow = ingredientsArray.length;
        if (previousRow === undefined) previousRow = 9;
        dropRow = + event.target.dataset.row;
        // add blur event to the clicked cell:
        event.target.addEventListener("blur", changeIngredients);
        dom.body.style.userSelect = "auto";
        // remove grabbing cursor style:
        dom.editable[1].style.cursor = "pointer";
        // remove the grabbed style:
        if (dom.trAll[previousRow + 1]) dom.trAll[previousRow + 1].classList.remove("move-ingredient-row");
        dom.trAll.forEach(row => {
            if (row.firstChild.dataset) row.removeEventListener("mouseover", moveIngeridientRow);
        });
        // set up again the removed other events :
        dom.tdAll.forEach((cell, index) => {
            if ((index + 1) % 4 === 0) {
                // these cells are the delete buttons:
                cell.addEventListener("click", deleteIngredients);
                cell.addEventListener("mouseover", hoverDeleteIngredients);
                cell.addEventListener("mouseout", hoverDeleteIngredients);
            }
        });
        
        // style the selected cell:
        event.target.style.border = "2px solid green";
        event.target.classList.add("move-ingredient-row");
        
        if (lastRow === dropRow ||
            previousRow === dropRow) return; // to turn editable the cell
        refreshStorage(currentRecipe);
        ingredientsTable(); // important to refresh all listener or generate bugfix!!!
    };
    
    //  -----------------------------------    Edit directions    -----------------------------------
    
    const updateDirections = () => {
//        console.log("blur event", event);
        const listElements = event.target.children,
              directionsArray = currentRecipe.content.directions
        ;
        let updated = false;
        if (directionsArray.length !== listElements.length) {
            directionsArray.length = listElements.length;
            updated = true;
        }
        for (let i = 0; i <  listElements.length; i ++) {
            let currentContent = sanitizeInput(listElements[i].textContent),
                storedContent = directionsArray[i]
            ;
            if (currentContent !== storedContent) {
                updated = true;
                // update dataset:
                directionsArray[i] = currentContent;
            }
        }
        if (updated) refreshStorage(currentRecipe);
    };
    
    // toggle edit mode style on/off:
    document.getElementById("nav-container").classList.toggle("hide");
    deletetIconContainer.classList.toggle("hide");
    backButton.classList.toggle("hide");
    modalHack.classList.toggle("hide");
    recipeName.classList.toggle("editable");
    selectCategory.classList.toggle("hide");
    // create table to edit ingredients:
    ingredientsTable();
    categorySelector();
    dom.table = document.querySelector("[id^=content] ul table");
    directions.classList.toggle("editable");
    editContainer.classList.toggle("edit-mode-on"); // move top left the edit icon
    dom.header = header;
    dom.headerContainer.classList.toggle("edit-mode-on");
    if (editIcon.dataset.editmode === "off") {
        nextButton.style.display = "none"; // class hide cannot to use because the flip-book class use display property
        // show the edit style input fields:
        // style the edit form:
        const hexBgColor = namedColorToHex(bgColor), 
              hexTextColor = namedColorToHex(textColor)
        ;
        const changeStyleForm = `
            <div id="editStyle" class="editShadow">
                <div>
                    <h1>Change image</h1>
                    <p class="editShadow">
                        <label for="image-url">Change url</label>
                        <input id="url" type="url" name="url" placeholder="http://example.com..." />
                    </p>
                    <p class="editShadow">Image size:<br />
                        <input id="center" type="radio" name="position" value="auto" />
                        <label for="none">None</label>
                        <input id="cover" type="radio" name="position" value="cover" />
                        <label for="cover">Cover</label>
                        <input id="hundred" type="radio" name="position" value="100% 100%" />
                        <label for="hundred">100%</label>
                    </p>
                    <h1>Change recipe style</h1>
                    <p class="editShadow">
                        <label for="bg-color">Change background color</label>
                        <input id="bg-color" type="color" name="bg-color" value="${hexBgColor}" />
                    </p>
                    <p class="editShadow">
                        <label for="text-color">Change text color</label>
                        <input id="text-color" type="color" name="text-color" value="${hexTextColor}" />
                    </p>
                </div>
            </div>
        `;
        leftSideContent.innerHTML = changeStyleForm;
        dom.editStyle = document.getElementById("editStyle");
        dom.editStyle.style.backgroundColor = bgColor;
        dom.editStyle.style.color = textColor;
        dom.editStyle.style.color = textColor;
        dom.editStyle.style.transition = "2s";
        // switch on edit mode:
        editIcon.dataset.editmode = "on";
        editContainer.setAttribute("title", "Click to close Edit Mode");
        // turn editable the content page:
        recipeName.setAttribute("contenteditable", true); // Name of recipe        
        directions.setAttribute("contenteditable", true); // directions
        // change header:
        header.textContent = "Edite mode: ON";
        
        // add listener to check if the user click outside of the book: --> editmode off:
        window.onclick = closeEditMode;
        
        // add blur event to edit recipe name:
        recipeName.addEventListener("blur", changeName);
        
        // add blur event to edit directions list:
        directions.addEventListener("blur", updateDirections);
        
    //  -----------------------------------    Edit the Style:    -----------------------------------
        // add change event to the URL input:
        dom.inputUrl = document.getElementById("url");
        dom.inputUrl.addEventListener("change", () => {
//            console.log(event.target.value);
            const regEx = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            if (regEx.test(event.target.value)) {
                // valid url
                dom.inputUrl.style.background = "PaleGreen";
                currentRecipe.image.backgroundImage = `url("${event.target.value}")`;
                refreshStorage(currentRecipe);
                event.target.offsetParent.style.backgroundImage = currentRecipe.image.backgroundImage;
            } else {
                // invalid url
                dom.inputUrl.style.background = "LightPink";
            }
        });
        
        // add change event to the image size radio inputs:
        dom.imageSizeRadioColl = document.querySelectorAll("#editStyle [type=radio]");
        for (let i = 0; i < dom.imageSizeRadioColl.length; i ++) {
            dom.imageSizeRadioColl[i].addEventListener("change", () => {
//                console.log(event.target.value);
                currentRecipe.image.backgroundSize = event.target.value;
                currentRecipe.image.backgroundRepeat = "no-repeat";
                currentRecipe.image.backgroundSize = event.target.value;
                refreshStorage(currentRecipe);
                event.target.offsetParent.style.backgroundSize = event.target.value;
                dom.editStyle.style.backgroundColor = "transparent";
                dom.editStyle.style.color = "transparent";
                setTimeout(() => {
                    dom.editStyle.style.backgroundColor = bgColor;
                    dom.editStyle.style.color = textColor;
                }, 2000);
            });
        }
        
        // add change event to the background color input:
        dom.recipeBgColor = document.getElementById("bg-color");
        dom.recipeBgColor.addEventListener("change", () => {
//            console.log(event);
            currentRecipe.content.stylePage.backgroundColor = event.target.value;
            rightInnerContaniner.style.backgroundColor = event.target.value;
            refreshStorage(currentRecipe);
        });
        
        // add change event to the text color input:
        dom.recipeTextColor = document.getElementById("text-color");
        dom.recipeTextColor.addEventListener("change", () => {
            currentRecipe.content.styleContent.color = event.target.value;
            rightContentContainer.style.color = event.target.value;
            refreshStorage(currentRecipe);
        });
        
    } else {
        // switch off edit mode:
        
        // have to remove all event listener
        recipeName.removeEventListener("blur", changeName);
        selectCategory.innerHTML = ``; // empty the previous options
        dom.tdAll.forEach((cell, index) => {
            if ((index + 1) % 4 === 0) {
                // these cells are the delete buttons:
                cell.removeEventListener("click", deleteIngredients);
                cell.removeEventListener("mouseover", hoverDeleteIngredients);
                cell.removeEventListener("mouseout", hoverDeleteIngredients);
            }
        });
        // remove click event from modal hack:
        window.onclick = "";
        
        // delete the Change Style input fields:
        ingredients.innerHTML = createIngredientsList(ingredientsArray);
        leftSideContent.innerHTML = "";
        nextButton.style.display = "block";
        editIcon.dataset.editmode = "off";
        editContainer.setAttribute("title", "");
        recipeName.setAttribute("contenteditable", false); 
        ingredients.setAttribute("contenteditable", false); 
        directions.setAttribute("contenteditable", false);
        header.innerHTML = "Build a Recipe Box";
    }
};

//  -----------------------------------    Delete recipe    -----------------------------------  
export const deleteRecipe = (recipes, recipeIndex) => {
//    console.log(event);
    
    const dom = {
        headerContainer: document.querySelector("header"),
        rightPage: event.target.parentElement.parentElement.parentElement.parentElement.parentElement,
        rightInnerContaniner: event.target.parentElement.parentElement.parentElement.parentElement,
        rightContentContainer: event.target.parentElement.parentElement.parentElement,
        editContainer: event.target.offsetParent,
        editIconContainer: event.target.offsetParent.firstElementChild,
        deleteIcon: event.target,
        modalHack: document.querySelector(".modalHack")
    };
    
    const currentRecipe = recipes[recipeIndex];
    
    dom.backButton = dom.rightPage.previousElementSibling.children[1].children[1];
    dom.nextButton = dom.rightInnerContaniner.children[1];
    // toggle styles:
    document.getElementById("nav-container").classList.toggle("hide");
    dom.backButton.classList.toggle("hide");
    dom.modalHack.classList.toggle("hide");
    dom.headerContainer.classList.toggle("delete-mode-on");
    dom.editContainer.classList.toggle("delete-mode-on"); // move top right the delete icon
    
    const deleteModeEnd = () => {
        dom.deleteIcon.dataset.deletemode = "off";
        dom.editIconContainer.style.width = "50px";
        dom.nextButton.style.display = "block";
        header.innerHTML = "Build a Recipe Box";
        window.onclick = "";
    };
    
    if (dom.deleteIcon.dataset.deletemode === "off") {
        dom.deleteIcon.dataset.deletemode = "on";
        dom.editIconContainer.style.width = 0;
        dom.nextButton.style.display = "none";
        header.innerHTML = "Are you sure you want to delete this recipe? Click here to delete";
        
        // add listener to check if the user click outside of the book: --> delete mode off:
        const closeDeleteMode = () => {
            if (event.target !== dom.deleteIcon) {
                document.getElementById("nav-container").classList.toggle("hide");
                dom.backButton.classList.toggle("hide");
                dom.modalHack.classList.toggle("hide");
                dom.headerContainer.classList.toggle("delete-mode-on");
                dom.editContainer.classList.toggle("delete-mode-on"); // move top right the delete icon
                deleteModeEnd();
                return false;
            }
        };
        
        window.onclick = closeDeleteMode;
    } else {
        // delete mode end:
        deleteModeEnd();
        // delete the recipe now:
        recipes.splice(recipeIndex, 1);
        refreshStorage(currentRecipe);
        document.getElementById("closeSearchMode").click(); // to close search mode
        recipes = JSON.parse(localStorage.getItem("myRecipes"));
        return true;
    }  
};

// refresh the local storage:
const refreshStorage = currentRecipe => {
    const myRecipes = JSON.parse(localStorage.getItem("myRecipes"));
    console.log("myRecipes", myRecipes);
    console.log("currentRecipe", currentRecipe);
    // current recipe validation before saving:
    if (currentRecipe.name !== "My new recipe" &&
        currentRecipe.content.ingredients.length &&
        currentRecipe.content.directions[0] !== " ") {
        myRecipes[currentRecipe.id] = currentRecipe;
        localStorage.setItem("myRecipes", JSON.stringify(myRecipes));
    } else {
        // inform the user why not saved the recipe:
    }
};

export const refreshCategoryShadow = (currentRecipe = null) => {
    const allCategories = document.querySelectorAll(".recipesMenu .menu");
    allCategories.forEach(button => button.style.boxShadow = "7px 6px 13px 0px rgba(0, 0, 0, 0.8)");
    if (currentRecipe) {
        document.getElementById(currentRecipe.category).style.boxShadow = "7px 6px 13px 0px rgba(0, 255, 0, 0.8)";
    }
}
    
const namedColorToHex = namedColor => {
    const html = document.querySelector("html");
    const originalColor = html.style.color;
    html.style.color = namedColor;
    const rgbFormatBgColor = window.getComputedStyle(html).color;
    if (namedColor !== "black" && rgbFormatBgColor === "rgb(0, 0, 0)") {
        console.warn(`Not supported named color: ${namedColor}`);
    }
    html.style.color = originalColor;
    const regEx = /(\d+)/g;
    const result = rgbFormatBgColor.match(regEx);
    let hexColor = `#`;
    result.forEach(value => {
        let hex = Number(value).toString(16);
        if (hex.length === 1) {
            hex = `0${hex}`;
        }
        hexColor += hex;
    });
    return hexColor;
};
