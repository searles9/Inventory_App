// --------------------------------------------------------- //
// -------------------- GLOBAL VARS -------------------- //
const baseUrl = 'http://localhost:8080';
const itemsPerPage = 15
let timerID = null;
let _row = null;
// facts array
dbFacts = [
    {
        factTitle: "TOTAL SKUS",
        factValueFunc: dbGetTotalItems
    },
    {
        factTitle: "TOTAL ITEMS IN STOCK",
        factValueFunc: dbGetTotalQuantity
    },
    {
        factTitle: "MOST IN STOCK",
        factValueFunc: dbGetMostInStock
    },
    {
        factTitle: "LEAST IN STOCK",
        factValueFunc: dbGetLeastInStock
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

function removeUrlSpaces(url) {
    return url.replace(" ", "%20")
}

async function reRenderPage() {
    await renderFacts(dbFacts)
    currentPage = await findCurrentPage()
    await renderInventory(currentPage,itemsPerPage)
    let footerNavHtml = await generateFooterNavMenuHtml(currentPage)
    await renderFooterNavMenu(footerNavHtml)
}
// --------------------------------------------------------- //
// -------------------- QUERY DB CODE -------------------- //
async function dbAddItem(item, quantity, price) {
    let url = baseUrl + '/inventory/add'
    options = {
        method: 'POST',
        body: JSON.stringify({
            item,
            quantity,
            price
        }),
        headers : {
            'Content-Type':'application/json'
        }
    }

    res = await (await fetch(url, options));
    if (res.ok) {
        return data = await res.json()
    }
    return res.text().then(text => {
        errorMessage = `${res.status} - ${JSON.parse(text).errors}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    })
}

async function dbUpdateItem(item,quantity,price) {
    let url = baseUrl + `/inventory/update`
    options = {
        method: 'PUT',
        body: JSON.stringify({
            item,
            quantity,
            price
        }),
        headers : {
            'Content-Type':'application/json'
        }
    }

    res = await (await fetch(url, options));
    if (res.ok) {
        return data = await res.json()
    }
    return res.text().then(text => {
        errorMessage = `${res.status} - ${JSON.parse(text).errors}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    })
}

async function dbDeleteItem(item) {
    let url = baseUrl + `/inventory/delete/${removeUrlSpaces(item)}`
    options = {
        method: 'DELETE',
        headers : {
            'Content-Type':'application/json'
        }
    }

    res = await (await fetch(url, options));
    if (res.ok) {
        return data = await res.json()
    }
    return res.text().then(text => {
        errorMessage = `${res.status} - ${JSON.parse(text).errors}`
        console.log(errorMessage)
        throw new Error(errorMessage)
    })
}

async function dbGetTotalItems() {
    let url = baseUrl + '/inventory/facts/totalItems'
    try {
        let res = await (await fetch(url)).json();
        return parseInt(res['totalItems'])
    } catch (error) {
        console.log(error)
    }
}

async function dbGetTotalQuantity() {
    let url = baseUrl + '/inventory/facts/totalQuantity'
    try {
        let res = await (await fetch(url)).json();
        return parseInt(res['totalItems'])
    } catch (error) {
        console.log(error)
    }
}

async function dbGetMostInStock() {
    let url = baseUrl + '/inventory/facts/mostInStock'
    try {
        let res = await (await fetch(url)).json();
        return res['mostInStock']
    } catch (error) {
        console.log(error)
    }
}

async function dbGetLeastInStock() {
    let url = baseUrl + '/inventory/facts/leastInStock'
    try {
        let res = await (await fetch(url)).json();
        return res['leastInStock']
    } catch (error) {
        console.log(error)
    }
}

async function dbGetInventory(page, limit) {
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
    let inventory = await dbGetInventory(page, limit);
    let html = '';
    for (const item in inventory) {
        let htmlSegment = `
        <div class="divTableRow">
          <div class="divTableCell">${inventory[item]['id']}</div>
          <div class="divTableCell">${inventory[item]['item']}</div>
          <div class="divTableCell">${inventory[item]['quantity']}</div>
          <div class="divTableCell">${inventory[item]['price']}</div>
          <div class="divTableCell editTableCell">
            <ul>
              <li>
                <a href="#" onclick="triggerEdit(this)">Edit</a>
              </li>
            </ul>
          </div>
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
    let totalItems = await dbGetTotalItems()
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
// -------------------- TABLE UPDATE CODE -------------------- //

// add a function that called "rerenderPageAfterUpdate"
    // run all the duplicate code below 

async function fillFormInputs(item, quantity, price) {
    document.getElementById('item').value = item;
    document.getElementById('quantity').value = quantity;
    document.getElementById('price').value = price;
}

async function getFormInputs() {
    let item = document.getElementById("item").value; 
    let quantity = document.getElementById("quantity").value; 
    let price = document.getElementById("price").value; 
    if (item === "" || quantity === "" || price === "") {
        throw new Error('Form inputs are empty!')
    }
    return {
        item,
        quantity,
        price
    }
}

async function displayOutcome(message, errorMessage = false) {
    let outcomeMessage = document.querySelector('.form-outcome-message');
    outcomeMessage.innerHTML = message;

    if (errorMessage) {
        outcomeMessage.style.color = 'white'
    } else {
        outcomeMessage.style.color = 'white' // #203113
    }

    // starting/restarting timer
    clearTimeout(timerID)
    
    if (errorMessage === false) {
        timerID = setTimeout(() => {
            let outcomeMessage = document.querySelector('.form-outcome-message');
            outcomeMessage.innerHTML = '';
        }, 10000)
    }
}

async function clearItemForm() {
    document.getElementById('item').value = "";
    document.getElementById('quantity').value = "";
    document.getElementById('price').value = "";
}

async function triggerEdit(editButton) {
    //_row = editButton.parentElement
    _row = editButton.closest(".divTableRow")
    let cols = _row.children;
    let item = cols[1].innerHTML
    let quantity = cols[2].innerHTML
    let price = cols[3].innerHTML
    await fillFormInputs(item, quantity, price)
    //divTableRow
    // poulate the form with the values of the item
    // console.log(`Got the item value: ${x}`)
    // console.log(`Got the quantity value: ${x}`)
    // console.log(`Got the price value: ${x}`)
}

async function itemAdd() {
    let outcome;
    try {
        formInput = await getFormInputs()
    } catch {
        displayOutcome('Fill out the form!', true)
        return
    }

    try {
        outcome = await dbAddItem(
            formInput.item,
            formInput.quantity,
            formInput.price
        ) 
        console.log(outcome)
    } catch (error) {
        console.log(error)
        outcomeMessage = `${error}`
        displayOutcome(outcomeMessage, true)
        return
    }
    await reRenderPage()
    outcomeMessage = `"${formInput.item}" has been added!`
    displayOutcome(outcomeMessage)
    clearItemForm()
}

async function itemUpdate() {
    let outcome;
    try {
        formInput = await getFormInputs()
    } catch {
        displayOutcome('Fill out the form!', true)
        return
    }
    
    try {
        outcome = await dbUpdateItem(
            formInput.item,
            formInput.quantity,
            formInput.price
        ) 
        console.log(outcome)
    } catch (error) {
        console.log(error)
        outcomeMessage = `${error}`
        displayOutcome(outcomeMessage, true)
        return
    }

    await reRenderPage()
    outcomeMessage = `"${formInput.item}" item has been updated!`
    displayOutcome(outcomeMessage)
    clearItemForm()
}

async function itemDelete() {
    try {
        formInput = await getFormInputs()
    } catch {
        displayOutcome('Fill out the form!', true)
        return
    }
    
    try {
        outcome = await dbDeleteItem(formInput.item) 
        console.log(outcome)
    } catch (error) {
        console.log(error)
        outcomeMessage = `${error}`
        displayOutcome(outcomeMessage, true)
        return
    }

    await reRenderPage()
    outcomeMessage = `"${formInput.item}" item has been deleted!`
    displayOutcome(outcomeMessage)
    clearItemForm()
}





// --------------------------------------------------------- //
// -------------------- LOAD PAGE CODE -------------------- //
window.onload = async function renderPageAtLaunch() {
    await renderInventory(1,itemsPerPage)
    let footerNavHtml = await generateFooterNavMenuHtml(1)
    await renderFooterNavMenu(footerNavHtml)
    await renderFacts(dbFacts)

    // render facts at an interval (interval in ms)
    renderFactsInterval = 60000 // 1 minute: 60000
    setInterval(function(){ 
        renderFacts(dbFacts)
    }, renderFactsInterval);
}


// TO-DO
// Update the error handling for the fact endpoints
// Add validation on the back end for the API calls
// Add validation on the front end for the API calls 
// Add the ability to rename a row