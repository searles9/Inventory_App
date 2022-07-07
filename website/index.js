// --------------------------------------------------------- //
// -------------------- GLOBAL VARS -------------------- //
const baseUrl = 'http://localhost:8080';
const itemsPerPage = 15
// facts array
dbFacts = [
    {
        factTitle: "TOTAL SKUS",
        factValueFunc: getTotalItems
    },
    {
        factTitle: "TOTAL ITEMS IN STOCK",
        factValueFunc: getTotalQuantity
    },
    {
        factTitle: "MOST IN STOCK",
        factValueFunc: getMostInStock
    },
    {
        factTitle: "LEAST IN STOCK",
        factValueFunc: getLeastInStock
    }
]
// --------------------------------------------------------- //
// -------------------- SOME UTIL CODE -------------------- //
async function findCurrentPage() {
    let activePageElement =  document.getElementById("currentPage");
    let activePage
    if (activePageElement) {
        activePage = parseInt(activePageElement.textContent)
    } else {
        activePage = 1
    }
    return activePage
}
// --------------------------------------------------------- //
// -------------------- QUERY DB CODE -------------------- //
async function getTotalItems() {
    let url = baseUrl + '/inventory/totalItems'
    try {
        let res = await (await fetch(url)).json();
        return parseInt(res['totalItems'])
    } catch (error) {
        console.log(error)
    }
}

async function getTotalQuantity() {
    let url = baseUrl + '/inventory/totalQuantity'
    try {
        let res = await (await fetch(url)).json();
        return parseInt(res['totalItems'])
    } catch (error) {
        console.log(error)
    }
}

async function getMostInStock() {
    let url = baseUrl + '/inventory/mostInStock'
    try {
        let res = await (await fetch(url)).json();
        return res['mostInStock']
    } catch (error) {
        console.log(error)
    }
}

async function getLeastInStock() {
    let url = baseUrl + '/inventory/leastInStock'
    try {
        let res = await (await fetch(url)).json();
        return res['leastInStock']
    } catch (error) {
        console.log(error)
    }
}

async function getInventory(page, limit) {
    let url = baseUrl + `/inventory?page=${page}&limit=${limit}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}
// --------------------------------------------------------- //
// -------------------- DB FACTS CODE -------------------- //
// Take an array of objects that contains the title, a placeholder value and the function to get the value
// {factTitle: "x", factValue: "x"}
// Run a for loop that generates the html 
// Populate the html in the browser

// Make a function to update the html   
    // Take an array of objects that contains the title, a placeholder value and the function to get the value
    // {factTitle: "x", factValue: "x"}
    // Run a for loop that generates the html 
    // Populate the html in the browser
// ------ run this function when the page loads 
// ------ run this function every 1 minitue on an interval 
          // https://www.codegrepper.com/code-examples/javascript/javascript+run+every+minute
          // https://www.willmaster.com/blog/javascript/javascript-setinterval.php

async function renderFacts(factsObj) {
    let html = ''
    for (const item of factsObj) {
        factHtmlSegment = `
        <div class="fact">
          <h1 class="fact-title">${item.factTitle}</h1>
          <h1 class="fact-value">${await item.factValueFunc()}</h1>
        </div>
        `;
        
        html += factHtmlSegment
    };

    let factsContainer = document.querySelector('.facts-container');
    factsContainer.innerHTML = html;
}


// --------------------------------------------------------- //
// -------------------- DB TABLE CODE -------------------- //

async function renderInventory(page, limit) {
    let inventory = await getInventory(page, limit);
    let html = '';
    for (const item in inventory) {
        let htmlSegment = `
        <div class="divTableRow">
          <div class="divTableCell">${inventory[item]['id']}</div>
          <div class="divTableCell">${inventory[item]['item']}</div>
          <div class="divTableCell">${inventory[item]['quantity']}</div>
          <div class="divTableCell">$${inventory[item]['price']}</div>
          <div class="divTableCell">EDIT</div>
        </div>
        `;

        html += htmlSegment;
    };

    let tableBodyDiv = document.querySelector('.divTableBody');
    tableBodyDiv.innerHTML = html;
}
// --------------------------------------------------------- //
// -------------------- FOOTER NAV CODE -------------------- //
async function generateFooterNavMenuHtml(pageToRenderFor) {
    // Get total pages needed based on the number of items in the DB
    let totalItems = await getTotalItems()
    let totalPages = Math.ceil(totalItems / itemsPerPage)
    let html = ''; 
    if ( pageToRenderFor > 1) {
        html += `<a href="#" id="prevTablePage" onclick="renderInventory(${pageToRenderFor - 1},${itemsPerPage});prevTablePage();">&laquo; Prev</a> `
    }
    html += `
            <p>Page</p>
            <a id="currentPage">${pageToRenderFor}</a>
            <p>of</p>
            <a>${totalPages}</a> `

    if ( (pageToRenderFor + 1 <= totalPages) && (totalPages > 1) ) {
                html += `<a href="#" id="nextTablePage" onclick="renderInventory(${pageToRenderFor + 1},${itemsPerPage});nextTablePage();">Next &raquo;</a> `
    }
    return html
}

async function renderFooterNavMenu(html) {
    let footerNavLinks = document.querySelector('.dbTable .tableFootStyle .links');
    footerNavLinks.innerHTML = html;
}

async function nextTablePage() {
    console.log("Next table page");
    let currentPage = await findCurrentPage()
    let footerNavHtml = await generateFooterNavMenuHtml(currentPage + 1)
    await renderFooterNavMenu(footerNavHtml)
}

async function prevTablePage() {
    console.log("Previous table page");
    let currentPage = await findCurrentPage()
    let footerNavHtml = await generateFooterNavMenuHtml(currentPage - 1)
    await renderFooterNavMenu(footerNavHtml)
}
// --------------------------------------------------------- //
// -------------------- LOAD PAGE CODE -------------------- //
window.onload = async function renderPageAtLaunch() {
    await renderInventory(1,itemsPerPage)
    let footerNavHtml = await generateFooterNavMenuHtml(1)
    await renderFooterNavMenu(footerNavHtml)
    await renderFacts(dbFacts)

    // render facts at an interval (interval in ms)
    renderFactsInterval = 60000
    setInterval(function(){ 
        renderFacts(dbFacts)
    }, renderFactsInterval);
    // 2 seconds: 2000
    // 10 seconds:  10000
    // 30 seconds:  30000
    // 1 minute: 60000
}


// TO-DO
// Add an edit/add/delete button 
// Split this file into multible files/modules
// Update the CSS for the facts so the titles dynamically size and dont get cut off
    // Might be able to do this by making a div within the div and then setting...
    // white-space: wrap; 