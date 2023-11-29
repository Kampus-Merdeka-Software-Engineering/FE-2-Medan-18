let pathname = window.location.pathname;
let filename = pathname.split("/").pop();
let listCart = [];


// for Checkout
if (filename === "checkout.html") {
    console.log("This is checkout page");

    function checkCart() {
        var cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('listCart='));
        if (cookieValue) {
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }
    }

    function addCartToHTML() {
        // Clear data default
        let listCartHTML = document.querySelector('.returnCart .list');
        listCartHTML.innerHTML = '';

        let totalQuantityHTML = document.querySelector('.totalQuantity');
        let totalPriceHTML = document.querySelector('.totalPrice');
        let totalQuantity = 0;
        let totalPrice = 0;

        // If has product in Cart
        if (listCart) {
            listCart.forEach(product => {
                if (product) {
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.innerHTML =
                        `<img src="${product.image}">
                        <div class="info">
                            <div class="name">${product.name}</div>
                            <div class="price">Rp ${product.price} / Product</div>
                        </div>
                        <div class="quantity">${product.quantity}</div>
                        <div class="returnPrice">Rp ${product.price * product.quantity}</div>`;
                    listCartHTML.appendChild(newCart);
                    totalQuantity = totalQuantity + product.quantity;
                    totalPrice = totalPrice + (product.price * product.quantity);
                }
            })
        }
        totalQuantityHTML.innerText = totalQuantity;
        totalPriceHTML.innerText = 'Rp' + totalPrice;
    }
}


// for Index
else {
    console.log("This is home or landing page");
    let iconCart = document.querySelector('.iconCart');
    let cart = document.querySelector('.cart');
    let container = document.querySelector('.container');
    let close = document.querySelector('.close');
    let items = document.querySelectorAll('.slider .listSlider .item');
    let next = document.getElementById('next');
    let prev = document.getElementById('prev');
    let thumbnails = document.querySelectorAll('.thumbnail .item');

    // Variables
    let products = null;
    let teams = null;
    let countItem = items.length;
    let itemActive = 0;

    // Get product data from file json
    fetch('json/product.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();
        })

    // Get team data from file json
    fetch('json/team.json')
        .then(response => response.json())
        .then(data => {
            teams = data;
            addTeamToHTML();
        })
    
    // Event cart click
    iconCart.addEventListener('click', function () {
        if (cart.style.right == '-100%') { cart.style.right = '0'; }
        else { cart.style.right = '-100%'; }
    })

    // Event close click
    close.addEventListener('click', function () {
        cart.style.right = '-100%';
    })

    // Event next click
    next.onclick = function () {
        itemActive = itemActive + 1;
        if (itemActive >= countItem) {
            itemActive = 0;
        }
        showSlider();
    }

    //Event prev click
    prev.onclick = function () {
        itemActive = itemActive - 1;
        if (itemActive < 0) {
            itemActive = countItem - 1;
        }
        showSlider();
    }

    // Auto run slider
    let refreshInterval = setInterval(() => {
        next.click();
    }, 5000)

    function showSlider() {
        // Remove item active old
        let itemActiveOld = document.querySelector('.slider .listSlider .item.active');
        let thumbnailActiveOld = document.querySelector('.thumbnail .item.active');
        itemActiveOld.classList.remove('active');
        thumbnailActiveOld.classList.remove('active');

        // Active new item
        items[itemActive].classList.add('active');
        thumbnails[itemActive].classList.add('active');

        // Clear auto time run slider
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
            next.click();
        }, 5000)
    }

    // Click Thumbnail
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            itemActive = index;
            showSlider();
        })
    })

    // Show team data in list 
    function addTeamToHTML() {

        // Remove team data default from HTML
        let listTeamHTML = document.querySelector('.team-card');
        listTeamHTML.innerHTML = '';

        // Add new datas
        if (teams != null) // if has data
        {
            teams.forEach(teamData => {
                let newData = document.createElement('div');
                newData.classList.add('column');
                newData.innerHTML =
                    `<div class="card">
                    <div class="img-container">
                        <img src="${teamData.image}" />
                    </div>
                    <h3><b>${teamData.name}</b></h3>
                    <h5>${teamData.university}</h5>
                    <h5>${teamData.major}</h5>
                    <p><b>${teamData.role}</b></p>
                </div>`;

                listTeamHTML.appendChild(newData);
            });
        }
    }

    // Show data product in list 
    function addDataToHTML() {

        // Remove data default from HTML
        let listProductHTML = document.querySelector('.listProduct');
        listProductHTML.innerHTML = '';

        // Add new datas
        if (products != null) // if has data
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.classList.add('item');
                newProduct.innerHTML =
                    `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">Rp ${product.price}</div>
            <button onclick="addCart(${product.id})">Add To Cart</button>`;

                listProductHTML.appendChild(newProduct);
            });
        }
    }

    // Use cookie so the cart doesn't get lost on refresh page
    function checkCart() {
        var cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('listCart='));
        if (cookieValue) {
            listCart = JSON.parse(cookieValue.split('=')[1]);
        } else {
            listCart = [];
        }
    }

    function addCart($idProduct) {
        let productsCopy = JSON.parse(JSON.stringify(products));
        // If this product is not in the cart
        if (!listCart[$idProduct]) {
            listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
            listCart[$idProduct].quantity = 1;
        } else {
            // If this product is already in the cart.
            listCart[$idProduct].quantity++;
        }
        document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
        addCartToHTML();
    }

    function addCartToHTML() {
        // Clear data default
        let listCartHTML = document.querySelector('.listCart');
        listCartHTML.innerHTML = '';

        let totalHTML = document.querySelector('.totalQuantity');
        let totalQuantity = 0;

        // If has product in Cart
        if (listCart) {
            listCart.forEach(product => {
                if (product) {
                    let newCart = document.createElement('div');
                    newCart.classList.add('item');
                    newCart.innerHTML =
                        `<img src="${product.image}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">Rp ${product.price} / Product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                    listCartHTML.appendChild(newCart);
                    totalQuantity = totalQuantity + product.quantity;
                }
            })
        }
        totalHTML.innerText = totalQuantity;
    }

    function changeQuantity($idProduct, $type) {
        switch ($type) {
            case '+':
                listCart[$idProduct].quantity++;
                break;
            case '-':
                listCart[$idProduct].quantity--;

                // If quantity <= 0, Then remove product in cart
                if (listCart[$idProduct].quantity <= 0) {
                    delete listCart[$idProduct];
                }
                break;

            default:
                break;
        }
        // Save new data in cookie
        document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
        addCartToHTML(); // Reload HTML view cart
    }
}

// Common script for both pages
function updateCart(){
    checkCart();
    addCartToHTML();
}

updateCart();