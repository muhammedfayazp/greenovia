const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const cards = document.querySelectorAll('.card');

if (priceRange) {
    priceRange.addEventListener('input', () => {
        priceValue.innerText = `$${priceRange.value}`;
        cards.forEach(card => {
            const price = parseFloat(card.dataset.price);
            card.style.display = price <= priceRange.value ? 'block' : 'none';
        });
    });
}
async function addToCart(id) {
    await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: 1 })
    });
    openCart();
}

async function openCart() {
    const res = await fetch('/cart.js');
    const cart = await res.json();
    const items = document.getElementById('cartItems');
    items.innerHTML = cart.items.map(i =>
        `<p>${i.product_title} × ${i.quantity}</p>`
    ).join('');
    document.getElementById('cartDrawer').classList.add('open');
}
