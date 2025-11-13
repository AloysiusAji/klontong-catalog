const API_URL = 'https://klontong-catalog.vercel.app/api/items';

// Load all items
async function loadItems() {
    const response = await fetch(API_URL);
    const items = await response.json();
    displayItems(items);
}

// Display items
function displayItems(items) {
    const list = document.getElementById('itemList');
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - Rp ${item.price}
            <div>
                <button onclick="editItem('${item._id}', '${item.name}', ${item.price})">Edit</button>
                <button onclick="deleteItem('${item._id}')">Hapus</button>
            </div>
        `;
        list.appendChild(li);
    });
}

// Add item
async function addItem() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    if (name && price) {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price: parseInt(price) })
        });
        loadItems();
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
    }
}

// Edit item
function editItem(id, name, price) {
    const newName = prompt('Nama baru:', name);
    const newPrice = prompt('Harga baru:', price);
    if (newName && newPrice) {
        fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, price: parseInt(newPrice) })
        }).then(() => loadItems());
    }
}

// Delete item
async function deleteItem(id) {
    if (confirm('Yakin hapus?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadItems();
    }
}

// Search items
async function searchItems() {
    const query = document.getElementById('search').value;
    const response = await fetch(`${API_URL}/search?q=${query}`);
    const items = await response.json();
    displayItems(items);
}

// Load items on page load
window.onload = loadItems;