let pathname = window.location.pathname;
let filename = pathname.split("/").pop();
let listCart = [];
let userID = null;
const API_BASE_URL = "https://be-2-medan-18.up.railway.app";

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

    document.getElementById('checkoutForm').addEventListener('submit', async function (event) {
        event.preventDefault();
        checkCart();
        getUserID();

        const name = document.getElementById('name').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const address = document.getElementById('address').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const pinOrCvv = document.getElementById('pinOrCvv').value;

        try {
            listCart = listCart.filter(product => product !== null)
            const response = await fetch(`${API_BASE_URL}/users/checkout`, {
                method: 'POST',  // Change this to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userID, name, phoneNumber, address, accountNumber, pinOrCvv, listCart }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Checkout successful.');
            } else {
                console.error('Checkout failed:', data.error);
            }
        } catch (error) {
            console.error('Error during checkout:', error.message);
        }
    });

    updateCart();
    getUserID();
}

// for Register
else if (filename === "register.html") {
    document.getElementById('registerForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Registration successful:', data);
            } else {
                console.error('Registration failed:', data.error);
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
        }
    });
}

// Function to fetch and display purchase history
else if (filename === "history.html") {
    async function getHistoryByUserID(userID) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/history?userID=${userID}`);
            const data = await response.json();

            if (response.ok) {
                console.log('User History:', data);
                // Display history entries on the page
                renderHistory(data);
            } else {
                console.error('Error retrieving user history:', data.error);
            }
        } catch (error) {
            console.error('Error during history retrieval:', error.message);
        }
    }

    // Function to render history entries on the page
    function renderHistory(historyData) {
        const historyEntries = document.getElementById('historyEntries');

        // Clear existing entries
        historyEntries.innerHTML = '';

        // Loop through historyData and create HTML entries
        historyData.forEach(historyEntry => {
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry');

            // Format date using Date object
            const formattedDate = new Date(historyEntry.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            entryDiv.innerHTML = `
                <div class="title">${formattedDate}</div>
                <div class="body">
                    <p class="name">${historyEntry.name}</p>
                    <p class="address">${historyEntry.address}</p>
                    <p class="nohp">${historyEntry.phoneNumber}</p>
                    <p class="menu">${getMenuList(historyEntry.listCart)}</p>
                    <p class="quantity">Quantity: ${getitem.quantity}</p>
                    <p class="price">Total Price: Rp ${getTotalPrice(historyEntry.listCart)}</p>
                </div>
            `;

            historyEntries.appendChild(entryDiv);
        });
    }

    // Helper function to get a formatted list of menu names
    function getMenuList(listCart) {
        return listCart.map(item => item.name).join(', ');
    }

    // Helper function to calculate the total price
    function getTotalPrice(listCart) {
        return listCart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getUserID();
    if (userID) {
        getHistoryByUserID(userID);
    }
}





// for Login
else if (filename === "login.html") {
    document.getElementById('loginForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',  // Change this to POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                const expirationDate = new Date();
                
                // Set the expiration to 7 days from now
                expirationDate.setDate(expirationDate.getDate() + 7);
                document.cookie = `userID=${data.userID}; expires=${expirationDate.toUTCString()}; path=/;`;

                console.log('Login successful. User ID:', data.userID);
            } else {
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    });

    getUserID();
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

    updateCart();
    getUserID();
}

// Common script for both pages
function updateCart() {
    checkCart();
    addCartToHTML();
}

function getUserID() {
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('userID='));
    if (cookieValue) {
        userID = JSON.parse(cookieValue.split('=')[1]);
    }
}