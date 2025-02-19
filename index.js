/**
 * Function injects specified HTML file to specified HTML 
 * node of the current file
 * 
 * @param filePath - a path to a source HTML file to inject
 * @param elem - an HTML element to which this content will 
 * be injected
 */
async function injectHTML(filePath, elem) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            return;
        }
        const text = await response.text();
        elem.innerHTML = text;
        // reinject all <script> tags
        // for each <script> tag on injected html
        elem.querySelectorAll("script").forEach(script => {
            // create a new empty <script> tag
            const newScript = document.createElement("script");
            // copy attributes of existing script tag 
            // to a new one
            Array.from(script.attributes).forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
            );
            // inject a content of existing script tag 
            // to a new one
            newScript.appendChild(
                document.createTextNode(script.innerHTML)
            )
            // replace existing script tag to a new one
            script.parentNode.replaceChild(newScript, script);
        })
    } catch (err) {
        console.error(err.message);
    }
}


/**
 * Function used to process all HTML tags of the following
 * format: <div include="<filename>"></div>
 * 
 * This function injects a content of <filename> to
 * each div with the "include" attribute
 */
async function injectAll() {
    let elems = document.querySelectorAll("[include]");
    while (elems.length > 0) {
        for (let elem of elems) {
            await injectHTML(elem.getAttribute("include"), elem);
            elem.removeAttribute("include");
        }
        elems = document.querySelectorAll("[include]");
    }
}


/**
 * Function used to switch between normal navigation bar
 * and burger button navigation bar
 */
function setResponsiveNavbar() {
    var x = document.getElementById("myNavbar");
    if (x.className === "navbar") {
        x.className += " responsive";
    } else {
        x.className = "navbar";
    }
}


/**
 * Function used to highlight navigationbar button the user
 * is currently on
 */
function setActiveNav() {
    var path = this.location.pathname;
    var nav = document.getElementsByClassName("navigation");
    var i;

    for (i = 0; i < nav.length; i++) {
        if (path === "/index.html" && nav[i].id === "home") {
            nav[i].className += " active";
        } else if (path === "/body/copyright.html" && nav[i].id === "copyright") {
            nav[i].className += " active";
        } else if (path === "/body/about.html" && nav[i].id === "about") {
            nav[i].className += " active";
        }
        else {
            nav[i].className = "navigation";
        }
    }
}


/**
 * Function used to show or hide the content of the collapsible subsections
 * in mobile phone screens
 */
function setCollapsibleDisplay() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}


/**
 * Function used to make the inspiration icon clickable
 */
function addInspirationEvent() {
    var inspiration = document.getElementsByClassName("insp-icon");
    var i;

    for (i = 0; i < inspiration.length; i++) {
        inspiration[i].addEventListener("click", function () {
            this.classList.toggle("active");
            if (this.style.color === "white" || this.style.color === "") {
                this.style.color = "black";
            } else {
                this.style.color = "white";
            }
        });
    }
}

/** wait until all DOM content is loaded (especially the parts that get injected later) 
 * to set active nav tab
*/
document.addEventListener("DOMContentLoaded", async () => {
    await injectAll()
    setActiveNav();
})

setCollapsibleDisplay();
addInspirationEvent();