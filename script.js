
let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let category = "All";

// Fetch products
async function loadProducts() {
    let res = await fetch("products.json");
    products = await res.json();
    showProducts(products);
    showCart();
}

loadProducts();

// Display products
function showProducts(list) {
    let output = "";

    list.forEach(p => {
        output += `
        <div class="card">
            <img src="${p.imageUrl}">
            <h3>${p.name}</h3>
            <p>${p.category}</p>
            <p>⭐ ${p.rating}</p>
            <p>₹${p.price}
            <del>₹${p.originalPrice}</del></p>
            <button onclick="addCart(${p.id})">Add to Cart</button>
        </div>`;
    });

    document.getElementById("products").innerHTML = output;

    document.getElementById("message").innerText =
        list.length === 0 ? "No products found" : "";
}

// Search and category filter
function filterProducts() {
    let search = document.getElementById("search").value.toLowerCase();

    let result = products.filter(p =>
        p.name.toLowerCase().includes(search) &&
        (category === "All" || p.category === category)
    );

    showProducts(result);
}

document.getElementById("search").addEventListener("input", filterProducts);

// Category filter
function filterCategory(c) {
    category = c;
    filterProducts();
}

// Add cart
function addCart(id) {
    let item = cart.find(p => p.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({id: id, qty: 1});
    }

    saveCart();
    showCart();
}

// Increase / decrease
function changeQty(id, n) {
    let item = cart.find(p => p.id === id);
    item.qty += n;

    if (item.qty <= 0) {
        removeCart(id);
    } else {
        saveCart();
        showCart();
    }
}

// Remove item
function removeCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    showCart();
}

// Save cart
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Display cart
function showCart() {
    let output = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        let p = products.find(x => x.id === item.id);

        if (!p) return;

        total += p.price * item.qty;
        count += item.qty;

        output += `
        <div>
            <h4>${p.name}</h4>
            ₹${p.price} × ${item.qty}
            <button onclick="changeQty(${p.id},1)">+</button>
            <button onclick="changeQty(${p.id},-1)">-</button>
            <button onclick="removeCart(${p.id})">Remove</button>
        </div>`;
    });

    document.getElementById("cart").innerHTML =
        output || "Cart is empty";

    document.getElementById("total").innerText = total;
    document.getElementById("count").innerText = count;
}
