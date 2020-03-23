"use strict";

class FlipBook {
    constructor(selector) {
        this.container = document.querySelector(selector);
        this.book = {
            timestamp: `${Date.now() - this.randNumber(0, 1000000)}`,
            inner: null,
            cover: null,
            backSide: null
        };
        this.opened = false;
        this.openTranslate = null;
        this.endTranslate = null;
        this.shadow = `7px 6px 13px 0px rgba(0, 0, 0, 0.8)`;
        this.currentSheet = 1;
        this.currentPage = 0;
        this.executable = () => {
//            console.log("this function will be call when flip the book");
        };
    }
    
    createBook(props) {
        let {
            page,
            width,
            height
        } = props;
        if (page < 2) page = 2;
        const sheet = Math.ceil(page / 2 + 1);
        this.sheet = sheet;
        
        // create content:
        const cover = ` id="cover${this.book.timestamp}" `;
        const backSide = ` id="backSide${this.book.timestamp}" `;
        let i = 0,
            content = "",
            pages = "",
            pageCounter = 0,
            style = {},
            backgroundColor = "#191966";
        
        for (i = 1; i <= sheet; i ++) {
            let pageId = ` id="p${this.book.timestamp}-${pageCounter}" `;
            pages += `
                <!--    Sheet ${i} content    -->
                <div id="page${this.book.timestamp}-${i}" class="page">
                    <div ${!(pageCounter) ? cover : pageId} class="front">
                        <div id='content${this.book.timestamp}-${!(pageCounter) ? "Cover" : pageCounter}'>
                            <h1>${!(pageCounter) ? "Cover" : "Page "}${!(pageCounter) ? "" : pageCounter}</h1>
                        </div>
                        <div class="next-btn">Next</div>
                    </div>
            `;
            pageCounter ++;
            pageId = ` id="p${this.book.timestamp}-${pageCounter}" `; // must redeclared the next id
            pages += `
                    <div ${i === sheet ? backSide : pageId} class="back">
                        <div id='content${this.book.timestamp}-${i === sheet ? "Back" : pageCounter}'>
                            <h1>${i === sheet ? "Back" : "Page "}${i === sheet ? "" : pageCounter}</h1>
                        </div>
                        <div class="back-btn">Back</div>
                    </div>
                </div>
            `;
            pageCounter ++;
            
        }
        content = `
            <div id="book${this.book.timestamp}" class="flip-book-inner">${pages}</div>
        `;
        this.container.innerHTML = content;
        this.book.inner = document.getElementById(`book${this.book.timestamp}`);
        this.book.cover = document.querySelector(`#cover${this.book.timestamp}`);
        this.book.backSide = document.querySelector(`#backSide${this.book.timestamp}`);
        
        // style flip book:
        style = {
            boxShadow: this.shadow,
            cursor: "pointer",
            transition: "0.5s"
        };
        this.styleElement(this.book.cover, style);
        this.styleElement(this.book.backSide, style);
        this.styleElement(document.querySelector(`#cover${this.book.timestamp} .next-btn`), {opacity: 0});
        this.styleElement(document.querySelector(`#backSide${this.book.timestamp} .back-btn`), {opacity: 0});
        style = {
            width: width,
            height: height,
            position: "relative",
            perspective: "1500px",
            transition: "0.3s ease-in-out",
        };
        this.styleElement(this.book.inner, style);
        style = {
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            transformOrigin: "left",
            transformStyle: "preserve-3d",
            transition: "0.3s ease-in-out",
            color: "white",
        };
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .page`), style);
        style = {
            backgroundColor: backgroundColor,
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            backfaceVisibility: "hidden"
        };
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .front`), style);
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .back`), style);
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .back`), {transform: "rotateY(180deg)"});
        const padding = "10px";
        style = {
            position: "absolute",
            bottom: padding,
            right: padding,
            cursor: "pointer",
        };
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .next-btn`), style);
        delete style.right;
        style.left = padding;
        this.styleElement(document.querySelectorAll(`#book${this.book.timestamp} .back-btn`), style);
        this.findHalf();
        
        for (i = 1; i <= sheet; i ++)  {
            style = {
                zIndex: sheet + 1 - i
            };
            this.styleElement(document.getElementById(`page${this.book.timestamp}-${i}`), style);
            // add click event to all next button:
            document.querySelectorAll(`#book${this.book.timestamp} .next-btn`)[i - 1].addEventListener("click", () => {
                // prevent propagation of the same event from being called:
                event.stopPropagation();
                this.nextSheet();
            });
            // add click event to all back button:
            document.querySelectorAll(`#book${this.book.timestamp} .back-btn`)[i - 1].addEventListener("click", () => {
                event.stopPropagation();
                this.prevSheet();
            });
        }
        
        // Add click event to the Cover to open the book:
        this.book.cover.addEventListener("click", () => {
            this.nextSheet(); 
        });
        
        // Add click event to the Backside to reopen the book:
        this.book.backSide.addEventListener("click", () => {
            this.prevSheet();
        });
    }
    
    // this function style the given element
    styleElement(elem, style) {
        let element = elem;
        for (let i = 0; i < elem.length || i < 1; i ++) {
            if (elem.length) element = elem[i];
            for (let key in style) {
                element.style[key] = style[key];
            }
        }
    }
    
    // style the given page (the full visible page):
    stylePage(page, style) {
        this.styleElement(this.getPageContainer(page), style);
    }
    
    // style the given page content (from top till the prev/next buttom):
    styleContent(page, style) {
        this.styleElement(this.getContentContainer(page), style);
    }
    
    changeShadow(shadow) {
        this.shadow = shadow;
        const style = {
            boxShadow: this.shadow,
        };
        this.styleElement(this.book.cover, style);
        this.styleElement(this.book.backSide, style);
        this.closeBook(); // need for shadow changing;
        this.openBook();
    }
    
    // find the half width of the book with regex:
    findHalf() {
//        const regEx = /(?<quantity>^\d+)(?<unit>\D+)/; // Named capturing group is not supported in Firefox???
        const regEx = /(^\d+)(\D+)/;
        const dirtyWidth = this.book.inner.style.width;
        const result = dirtyWidth.match(regEx);
//        const quantity = result.groups.quantity / 2; // not supported in Firefox???
//        const unit = result.groups.unit;             // not supported in Firefox???
        const quantity = result[1] / 2;
        const unit = result[2];
        this.openTranslate = `${quantity}${unit}`;
        this.endTranslate = `${quantity * 2}${unit}`;
    }
    
    openBook(translate) {
        this.translateAtOpen(translate);
        // add shadow to the first and to the last page:
        let style = {
            boxShadow: this.shadow
        };
        this.styleElement(document.querySelector(`#p${this.book.timestamp}-1`), style);
        this.styleElement(document.querySelector(`#p${this.book.timestamp}-${(this.sheet - 1) * 2}`), style);
        this.opened = true;
    }
    
    translateAtOpen(translate) {
        let style = {
            transform: `translate(${translate})`,
        };
        this.styleElement(this.book.inner, style);
    }
    
    closeBook(translate) {
        this.styleElement(this.book.inner, {transform: `translate(${translate})`});
        // remove the shadow from the opend pages:
        this.styleElement(document.querySelector(`#p${this.book.timestamp}-1`), {boxShadow: "none"});
        this.styleElement(document.querySelector(`#p${this.book.timestamp}-${(this.sheet - 1) * 2}`), {boxShadow: "none"});
        this.opened = false;
    }
    
    nextSheet() {
        document.getElementById(this.getContentId(this.currentPage)).style.display = "none";
        this.currentPage +=2;
        // hide the next button on the current page:
        document.querySelector(`#page${this.book.timestamp}-${this.currentSheet} .next-btn`).style.display = "none";
        if (!(this.opened)) {
            // book was closed, open it:
            this.openBook(this.openTranslate);
        } else if (this.currentSheet === this.sheet) {
            // it was the last page => end of the book:
            this.closeBook(this.endTranslate);
        }
        this.executable();
        const style = {
            transform: "rotateY(-180deg)",
            zIndex: this.currentSheet,
        };
        this.styleElement(document.getElementById(`page${this.book.timestamp}-${this.currentSheet}`), style);
        this.currentSheet ++;
    }
    
    prevSheet() {
        this.currentPage -=2;
        this.currentSheet --;
        document.getElementById(this.getContentId(this.currentPage)).style.display = this.currentPage === 0 ? "flex" : "block" ;
        // show the next button on the previous page:
        document.querySelector(`#page${this.book.timestamp}-${this.currentSheet} .next-btn`).style.display = "block";
        if (this.currentSheet === 1) {
            // book was opened, close it:
            this.closeBook(0);
        } else if (this.currentSheet === this.sheet) {
            // open from backside:
            this.openBook(this.openTranslate);
        }
        this.executable();
        const style = {
            transform: "rotateY(0deg)",
            zIndex: this.sheet + 1 - this.currentSheet,
        }
        this.styleElement(document.getElementById(`page${this.book.timestamp}-${this.currentSheet}`), style);
    }
    
    openAt(page) {
        const sheet = this.getSheet(page);
        if (this.currentPage > page) {
            do {
                this.prevSheet();
            } while (this.currentPage > page)
        } else if (this.currentPage < page) {
            do {
                this.nextSheet();
            } while (this.currentPage < page)
        }
    }
    
    getSheet(page) {
        if (page < 2 && !(this.opened)) return this.nextSheet();
        return Math.floor((page + 1) / 2);
    }
    
    getPageId(page) {
        return `p${this.book.timestamp}-${page}`;
    }
    
    getPageContainer(page) {
        return document.getElementById(`p${this.book.timestamp}-${page}`);
    }
    
    getContentContainer(page) {
        let id = null;
        if (page === "cover") {
            id = `content${this.book.timestamp}-Cover`;
        } else if (page === "back") {
            id = `content${this.book.timestamp}-Back`;
        } else {
            id = `content${this.book.timestamp}-${page}`;
        }
        return document.getElementById(id);
    }
    
    getContentId(page) {
        let id = null;
        if (page === "cover" || page === 0) {
            id = `content${this.book.timestamp}-Cover`;
        } else if (page === "back") {
            id = `content${this.book.timestamp}-Back`;
        } else {
            id = `content${this.book.timestamp}-${page}`;
        }
        return id;
    }
    
    addContent(page, content, clear = true) {
        const element = this.getContentContainer(page);
        if (!(element)) return console.warn("Page not found!");
        clear ? element.innerHTML = content : element.innerHTML += content;
    }
    
    // This function make a random number betveen the minimum and maximum (include both).
    randNumber(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }
}

export {
    FlipBook
};