const API_URL = 'https://klontong-catalog.vercel.app/api/items';

// Load semua barang
async function loadItems() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error('Response bukan array');
    displayItems(items);
  } catch (error) {
    console.error('Load items gagal:', error);
    alert('Gagal memuat daftar barang');
  }
}

// Tampilkan daftar barang ke halaman
function displayItems(items) {
  const list = document.getElementById('itemList');
  list.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${item.name} - Rp ${item.price}
      <div>
        <button onclick="editItemPrompt('${item._id}', '${item.name}', ${item.price})">Edit</button>
        <button onclick="deleteItem('${item._id}')">Hapus</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Tambah barang baru
async function addItem() {
  const name = document.getElementById('name').value.trim();
  const priceStr = document.getElementById('price').value.trim();
  const price = Number(priceStr);

  if (!name || isNaN(price) || price <= 0) {
    alert('Isi nama dan harga dengan benar!');
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Error server');
    }
    await loadItems();
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
  } catch (error) {
    console.error('Tambah barang gagal:', error);
    alert('Gagal menambah barang: ' + error.message);
  }
}

// Prompt edit barang lalu update
function editItemPrompt(id, currentName, currentPrice) {
  const newName = prompt('Nama baru:', currentName);
  if (newName === null) return; // batal
  const newPriceStr = prompt('Harga baru:', currentPrice);
  const newPrice = Number(newPriceStr);
  if (!newName.trim() || isNaN(newPrice) || newPrice <= 0) {
    alert('Isi data dengan benar!');
    return;
  }
  editItem(id, newName.trim(), newPrice);
}

// Update barang
async function editItem(id, name, price) {
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price })
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Error server');
    }
    await loadItems();
  } catch (error) {
    console.error('Update barang gagal:', error);
    alert('Gagal update barang: ' + error.message);
  }
}

// Hapus barang
async function deleteItem(id) {
  if (!confirm('Yakin ingin menghapus barang ini?')) return;
  try {
    const response = await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Error server');
    }
    await loadItems();
  } catch (error) {
    console.error('Hapus barang gagal:', error);
    alert('Gagal menghapus barang: ' + error.message);
  }
}

// Cari barang
async function searchItems() {
  const query = document.getElementById('search').value.trim();
  try {
    const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const items = await response.json();
    if (!Array.isArray(items)) throw new Error('Response bukan array');
    displayItems(items);
  } catch (error) {
    console.error('Cari barang gagal:', error);
    alert('Gagal mencari barang');
  }
}

// Load items awal saat halaman dibuka
window.onload = loadItems;
