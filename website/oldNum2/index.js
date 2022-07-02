// Front End JavaScript

const baseUrl = 'http://localhost:8080';

async function getInventory() {
    let url = baseUrl + '/inventory';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}

async function renderInventory() {
    let inventory = await getInventory();
    let html = '';
    for (const item in inventory) {
        // console.log(inventory[item])
        let htmlSegment = `<div class="user">
                              <h3>${inventory[item]['item']}</h3>
                              <h6>Quantity: ${inventory[item]['quantity']}</h6>
                              <h6>Price: ${inventory[item]['price']}</h6>
                           </div>`;

        html += htmlSegment;
    };

    let container = document.querySelector('.container');
    container.innerHTML = html;
}