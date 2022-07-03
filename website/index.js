// In progress

const baseUrl = 'http://localhost:8080';


async function getInventory(page, limit) {
    let url = baseUrl + `/inventory?page=${page}&limit=${limit}`;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error)
    }
}

async function renderInventory(page, limit) {
    let inventory = await getInventory(page, limit);
    let html = '';
    for (const item in inventory) {
        // console.log(inventory[item])

        let htmlSegment = `
        <div class="divTableRow">
          <div class="divTableCell">${inventory[item]['id']}</div>
          <div class="divTableCell">${inventory[item]['item']}</div>
          <div class="divTableCell">${inventory[item]['quantity']}</div>
          <div class="divTableCell">${inventory[item]['price']}</div>
          <div class="divTableCell">EDIT</div>
        </div>
        `;

        html += htmlSegment;
    };

    let tableBodyDiv = document.querySelector('.divTableBody');
    tableBodyDiv.innerHTML = html;
}

renderInventory(1,25)