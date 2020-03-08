"use strict";
import {FlipBook} from "./flipbook.js";
import {dataset, newRecipe} from "./dataset.js";
import {callAJAX} from "./ajax.js";
import * as updateBook from "./updatebook.js";
import * as searching from "./searching.js";
import {updateFooter} from "./footer.js";

let activeBook = "recipeBook", // to control wich book will be opened
    coverContent,                   // to fill the book cover
    recipeBook,
    searchMode = false
;

let recipes = dataset;

if (typeof(Storage) !== undefined) {
//    console.log("storage usable");
    if (!(localStorage.getItem("myRecipes"))) {
        localStorage.setItem("myRecipes", JSON.stringify(recipes));
    }
    recipes = JSON.parse(localStorage.getItem("myRecipes"));
} else {
    console.log("Sorry! No Web Storage supported...");
} 

const dom = {
    header: document.querySelector("body header"),
    recipesMenu: document.getElementById("recipesMenu"),
    loginMenu: document.getElementById("loginMenu"),
    loginBook: document.getElementById("loginBook"),
    search: document.getElementById("search"),
    closeSearchMode: document.getElementById("closeSearchMode"),
    addRecipe: document.getElementById("addRecipe")
};

//  --------------------    Login book    --------------------   
dom.loginBook.style.display = "none";

const loginBook = new FlipBook("#loginBook");
loginBook.createBook({
    page: 4,
    width: "40vw",
    height: "80vh"
});

coverContent = `
    <div>
        <div class="rounded-border" >
            <img id="loginCover" src="image/login.png" />
        </div>
        <h1>What shall I cook?</h1>
    </div>
`;
loginBook.addContent("cover", coverContent);

//  --------------------    Recipe book    -------------------- 
// coverContent: string, pageContent: array, openHere: number
const refreshRecipeBook = (pageContent, openHere = null) => {
    recipeBook = null ; // have to delete all previous data from the book
    recipeBook = new FlipBook("#recipeBook");
    activeBook = recipeBook;
    
    let ingredients, // array
        directions // array
    ;
    
    const coverContent = `
        <div>
            <img src="image/cover.svg" />
            <h1>My Recipe Box</h1>
        </div>
    `, backContent = `
        <div>
            <div id="backSideRecipe">
                <h3>This project was inspired by <a href="https://www.freecodecamp.org/learn/coding-interview-prep/take-home-projects/build-a-recipe-box" target="_blank">FreeCodeCamp</a></h3>
                <p>In this state, it meets the minimum requirements of the user-story.</p>
                <p>From now I will work to turn on this project as a fully usable site.</p>
                <ul>I am planning to build 
                    <li>a registration/login system</li>
                    <li>a database where the recipes stored</li>
                    <li>and maybe forum for all recipes where users can share their experiences</li>
                </ul>
                <p>If you have any suggestion, please contact me on <a href="https://www.freecodecamp.org/forum/t/build-a-recipe-box-my-recipe-book/357043" target="_blank">the FCC forum.</a></p>
                <p>Anything went wrong? <button id="resetWebStorage" title="This will delete all stored recipes by you and replace the original set!">Click here</button> to reset your webstorage.</p>
            </div>
        </div>
        <footer>&copy; Developed by <a href="http://cselko.offyoucode.co.uk/portfolio/" target="_blank">Csaba.</a> <span id="developed">2020</span><span id="presentYear">.</span>
            <a href="https://www.freecodecamp.org/lendoo" target="_blank">
                <img src="image/fcc-logo-white.png" alt="FreeCodeCamp logo" />
            </a>
        </footer>
    `;
    
    recipeBook.createBook({
        page: pageContent.length * 2, 
        width: "40vw",
        height: "80vh"
    });
    console.log(recipeBook);
    recipeBook.executable = () => {
        if (recipeBook.currentSheet < 2) return;
        if (event.target.innerText === "Next") {
            const prevEditContainer = event.target.parentElement.firstElementChild.firstElementChild;
            prevEditContainer.style.display = "none"; // have to hide the previous delete button!
        } else if (event.target.parentElement.id !== "searchResultContainer" &&
                   event.target.alt !== "FreeCodeCamp logo") { // bugfix if the event occured at the search bar
            const currentEditContainer = event.target.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild;
            if (currentEditContainer) currentEditContainer.style.display = "flex"; // at deletion avoid a bug
        }
        
    };

    // cover:
    recipeBook.styleContent("cover", {
        color: "white"
    });
    recipeBook.addContent("cover", coverContent);
    
    // back side:
    recipeBook.styleContent("back", {
        color: "white"
    });
    recipeBook.addContent("back", backContent);
    document.getElementById("resetWebStorage").addEventListener("click", () => {
        event.stopPropagation();
        localStorage.setItem("myRecipes", JSON.stringify(dataset)); // reset localStorage
        refreshRecipeBook(dataset, (recipeBook.currentSheet * 2) - 2);
    });
    
    updateFooter();

    // ------------------------------------ Fill recipe book ------------------------------------
    let page = 1;
    pageContent.forEach(recipe => {
        const content = updateBook.createRecipeContent(recipe.name, recipe.content.ingredients, recipe.content.directions, true);
        recipeBook.stylePage(page, recipe.image); // the image of recipe at left side
        recipeBook.addContent(page ++, ""); // to delete the class-generated content
        recipeBook.stylePage(page, recipe.content.stylePage);
        recipeBook.styleContent(page, recipe.content.styleContent);
        recipeBook.styleContent(page, {paddingRight: "20px"}); // add padding to the recipe content
        recipeBook.addContent(page ++, content);
    });
    
    // backside:
    
    // open at the selected page:
    if (openHere) openHere < 3 ? recipeBook.nextSheet() : recipeBook.openAt(openHere);
    
    // ------------------------------------ add click event to edit/delete icons ------------------------------------
    dom.edit = document.querySelectorAll(".edit");
    dom.delete = document.querySelectorAll(".delete");
    dom.edit.forEach((edit, index) => {
        edit.addEventListener("click", () => {
//            console.log(event);
            // toggle shadow:
            if (event.target.dataset.editmode === "off") {
                recipeBook.changeShadow(`7px 6px 13px 0px rgba(255, 255, 0, 0.8)`);
            } else {
                recipeBook.changeShadow(`7px 6px 13px 0px rgba(0, 0, 0, 0.8)`);
            }
            updateBook.editRecipe(pageContent, recipeBook.currentSheet - 2);
        });
        dom.delete[index].addEventListener("click", () => {
            // toggle shadow:
            if (event.target.dataset.deletemode === "off") {
                recipeBook.changeShadow(`7px 6px 13px 0px rgba(255, 0, 0, 0.8)`);
            }
            const isDeleted = updateBook.deleteRecipe(pageContent, recipeBook.currentSheet - 2);
            if (isDeleted) {
                openHere = recipeBook.currentSheet;
                refreshRecipeBook(pageContent, openHere);
            } else {
                recipeBook.changeShadow(`7px 6px 13px 0px rgba(0, 0, 0, 0.8)`);
            }
        });
    });
    
    // open at the current page
    if (openHere) {
        recipeBook.openAt(openHere);
    }
};


//  --------------------   New Recipes book    -------------------- 
const addNewRecipe = () => {
    const last = recipes.length - 1;
    dom.header.innerHTML = "<h2>Add new recipes</h2>";
    console.log(recipes[last].content.ingredients);
    console.log(recipes[last].content.ingredients.length);
    if (recipes[last].content.ingredients.length) {
        recipes.push(newRecipe);
    }
    refreshRecipeBook(recipes);
    activeBook = updateBook.changeBook(loginBook, recipeBook);
    recipeBook.openAt(recipes.length * 2);
    dom.edit[recipes.length - 1].click();
};

refreshRecipeBook(recipes);

//  --------------------   Open search mode    -------------------- 
const search = () => {
    
    activeBook = updateBook.changeBook(activeBook, recipeBook);
    if (!(searchMode)) {
        searchMode = true;
        dom.closeSearchMode.style.display = "block";
        // create the recipe's name cards:
        let content = "";
        recipes.forEach((recipe, index) => content += `
            <div style="background-color: ${recipe.content.stylePage.backgroundColor}; color: ${recipe.content.styleContent.color};" data-page="${(index + 1) * 2}">${recipe.name}</div>
        `);
        dom.header.innerHTML += `<div id="searchResultContainer">${content}</div>`;
        dom.allRecipes = document.querySelectorAll("#searchResultContainer > div");
        dom.allRecipes.forEach(element => {
            element.addEventListener("click", openBookHere);
        });
        // change h2 to search input:
        dom.header.firstElementChild.innerHTML = `
            <div id="searchInputContainer">
                <div>
                    <span id="filterContainer">
                        <span id="everyWhereContainer" class="hide">
                            <input type="checkbox" id="everyWhere" name="everyWhere" value="everyWhere" checked="checked" />
                            <label for="everyWhere">Everywhere</label>
                        </span>
                        <span id="otherOptionContainer" class="hide">
                            <input type="checkbox" id="inName" name="inName" value="inName" checked="checked" />
                            <label for="inName">in name</label>
                            <input type="checkbox" id="inIngredients" name="inIngredients" value="inIngredients" title="only in name of ingredients" />
                            <label for="inIngredients">in ingredients</label>
                            <input type="checkbox" id="inDirections" name="inDirections" value="inDirections" />
                            <label for="inDirections">in directions</label>
                        </span>
                    </span>
                    <input type="text" id="searchInput" data-keyup="false" />
                </div>
                <div id="searchInputIconContainer">
                    <img src="icons/search-input.svg" />
                </div>
            </div>
        `;
        dom.searchInputIconContainer = document.getElementById("searchInputIconContainer");
        dom.searchInputIconContainer.addEventListener("click", () => {
            searching.toogleSearchField(recipes);
        });
    } else {
        closeSearchMode();
    }
};

const openBookHere = () => {
//    console.log(event);
    recipeBook.openAt(+ event.target.dataset.page);
};

const closeSearchMode = () => {
    searchMode = false;
    dom.closeSearchMode.style.display = "none";
    dom.header.innerHTML = "<h2>Build a Recipe Box</h2>";
};

//  --------------------    add click event to the left side menu   --------------------    :
dom.recipesMenu.addEventListener("click", () => {
    activeBook = updateBook.changeBook(activeBook, recipeBook);
    dom.header.innerHTML = "<h2>All recipes</h2>";
    console.log("recipeBook", recipeBook);
    console.log("currentSheet", recipeBook.currentSheet);
    refreshRecipeBook(recipes, (recipeBook.currentSheet * 2) - 2);
});
dom.loginMenu.addEventListener("click", () => {
    activeBook = updateBook.changeBook(activeBook, loginBook); 
});

// open searchMode
dom.search.addEventListener("click", search); 
// close searchMode
dom.closeSearchMode.addEventListener("click", closeSearchMode);

dom.addRecipe.addEventListener("click", addNewRecipe);
