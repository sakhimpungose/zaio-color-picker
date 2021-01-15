// Used to record stuff
const records = {
    selected: {
        name: '',
        value: '',
        price: 0,
        'original-price': 0,
        discount: 0, 
        quantity: 0,
        change: 0,
    },
    cart: [],
};


/*
* Quantity control modal
* It is used by users to change the quantity of the currently selected color
*/
const quantityControlModalElement = document.getElementById('quantityControlModal');

// Quantity control modal instance
const quantityControlModal = new bootstrap.Modal(quantityControlModalElement, {backdrop: 'static'});

// Button used to decrease by one the quantity of a selected item
const modalQuantityControlMinusButton = document.getElementById("modalQuantityControlMinusButton");

// Button used to increase by one the quantity of a selected item
const modalQuantityControlPlusButton = document.getElementById("modalQuantityControlPlusButton");

// Displays the name of the currently selected item inside the quantity control modal
const modalColorNameDisplay = document.getElementById('modalColorNameDisplay');

// Displays the quantity value of the currently selected item inside the quantity control modal
const modalQuantityValueDisplay = document.getElementById('modalQuantityValueDisplay');

// Used by users to accept changes they have made to quantity for an item
const confirmQuantityButton = document.getElementById('confirmQuantityButton');

// Used by users to discard changes they have made to quantity for an item
const cancelQuantityChangeButton = document.getElementById("cancelQuantityChangeButton");

/*
* Check out modal
* It shows users the summery of items they have added to their cart, and it them an option to checkout
*/
const checkoutModalElement = document.getElementById('checkoutModal');

// Check out modal instance
const checkoutModal = new bootstrap.Modal(checkoutModalElement, {backdrop: 'static'});

// Used to display the summery of items inside the cart inside the checkout modal
const lineItems = document.getElementById("lineItems");

// Used to checkout, and reload the page
const finalCheckoutButton = document.getElementById("finalCheckoutButton");

/*
* Process control modal
* This modal clears the ambiguity found when a user clicks the check out button but we don't know
* whether the user wants to check out or they want to change quantity
*/
const processControlModalElement = document.getElementById('processControlModal');

// Process control modal instance
const processControlModal = new bootstrap.Modal(processControlModalElement, {backdrop: 'static'});

// When clicked, it redirects users to the quantity control modal
const changeQuantityButton = document.getElementById("changeQuantityButton");

// When clicked, it redirects users to the check out modal
const proccedToCheckoutButton = document.getElementById("proccedToCheckoutButton");

// Shows the discounted price of the currently selected color in the page
const colorPriceDisplay = document.getElementById("colorPriceDisplay");

// Shows the original price of the currently selected color in the page
const colorOriginalPriceDisplay = document.getElementById("colorOriginalPriceDisplay");

// Shows the discount percentage of the currently selected color in the page
const colorPriceDiscountDisplay = document.getElementById("colorPriceDiscountDisplay");

// Showa the name currently selected color in the page
const colorPickerTitle = document.querySelector("#colorPickerTitle span");

// Color picker container
const colorPicker = document.querySelector(".color-picker");

// Selecting all colors inside the color picker so that they can be found in one place
const colorPickerColors = document.querySelectorAll('.color-picker .color');

// Displays the quantity value of the currently selected in the page
const checkoutQuantityInput = document.getElementById("checkoutQuantityValue");

// Used to evoke the check out modal
const checkoutButton = document.getElementById("checkoutButton");

// Show the items that are currently in the cart
const purchasedItems = document.getElementById("purchasedItems");

// generates random price
const randomPrice = function(minPrice = 25, maxPrice = 500){
    return ((Math.random() * (maxPrice - minPrice)) + minPrice).toFixed(2);
}

// generates random discount percentage
const randomDiscountPercentage = function(minDiscountPercentage = 10, maxDiscountPercentage = 30){
    return Math.floor(Math.random() * (maxDiscountPercentage - minDiscountPercentage) ) + minDiscountPercentage;
};

// calculates the dicounted price
const getDiscountedPrice = function(price, discount){
    return (price * (100 - discount) / 100).toFixed(2);
}

// Loop through all color items
colorPickerColors.forEach(function(color){
    
    // generate random original price
    let originalPrice = randomPrice();

    // generate random discount percentage
    let discount = randomDiscountPercentage();

    // calculate discounted price
    let price = getDiscountedPrice(originalPrice, discount);

    // Setting various attributes to the color
    color.setAttribute("data-color-original-price", originalPrice);
    color.setAttribute("data-color-price", price);
    color.setAttribute("data-color-discount-percentage", discount);
    
    // Set background color for each color item to the corresponding data-color-value attribute
    color.style.backgroundColor = color.getAttribute("data-color-value");

    color.addEventListener("click", function(evt){
        // Is the clicked color already selected
        if (!evt.target.classList.contains("active")) {
            // If not
            deselectAllColors(); // deselected previously selected color
            evt.target.classList.add("active"); // select currently selected color
        }

        // has the color been added to the cart
        let matchFound = false;

        // if the cart has something, let us first search for the color there
        if(records.cart.length > 0){
            // looping through all colors inside the cart
            for(let i = 0; i < records.cart.length; i++){
                // if color is found inside the cart
                if(records.cart[i].value == evt.target.getAttribute('data-color-value')){
                    matchFound = true; // indicate that the color was found inside the cart
                    Object.assign(records.selected, records.cart[i]); // update records with data from the cart
                    break; // stop searching                    
                }
            }
        }

        // if color was not found inside the cart
        if(!matchFound){

            // create new record of the color
            records.selected.name = evt.target.getAttribute('data-color-name');
            records.selected.value = evt.target.getAttribute("data-color-value");
            records.selected.price = evt.target.getAttribute("data-color-price");
            records.selected.quantity = 0; 

            records.selected['original-price'] = evt.target.getAttribute('data-color-original-price');
            records.selected.discount = evt.target.getAttribute('data-color-discount-percentage');
        }

        records.selected.change = 0; // make sure that changes are at zero


        // Update page to reflect the state of the records
        colorPriceDisplay.innerHTML = "R" + records.selected.price;
        colorOriginalPriceDisplay.innerHTML = "R" + records.selected["original-price"];
        colorPriceDiscountDisplay.innerHTML = records.selected.discount + "% OFF";
        colorPickerTitle.innerHTML = records.selected.name;        
        checkoutQuantityInput.value = records.selected.quantity;
        
        // if color has some quantity
        if(records.selected.quantity > 0){
            checkoutButton.value = "Check out now"; // Change check out button display to "Check out now"
        }else{
            checkoutButton.value = "Add to Cart"; // otherwise, change it to "Add to Cart"
        }

        // setup quantity control modal with recently selected color
        configQuantityControlModal();

    }, false);
});

// deselects all selected colors
const deselectAllColors = function(){
    document.querySelectorAll(".color-picker .color.active").forEach(function (color) {
        color.classList.remove("active");
    });    
};

// update quantity control modal
const updateQuantityControlModal = function(){
    modalQuantityValueDisplay.innerHTML = records.selected.quantity + records.selected.change;
};

// setup quantity control modal
const configQuantityControlModal = function(){
    updateQuantityControlModal();
    modalColorNameDisplay.innerHTML = records.selected.name;
};

// Listen for when the quantity control modal is shown
quantityControlModalElement.addEventListener("show.bs.modal", function(evt) {
    modalColorNameDisplay.innerHTML = records.selected.name; // change the displayed color name inside the modal
    modalQuantityValueDisplay.innerHTML = records.selected.quantity + records.selected.change; // change the quantity displayed inside the modal
});

// Listen for when checkout button is clicked
checkoutButton.addEventListener("click", function(){
    // if color has some quantity, we don't know whether the user was the change quantity or to checkout
    if(records.selected.quantity > 0){
        processControlModal.show(); // So, give them the preocess control modal for the to decide
    }else{
        quantityControlModal.show(); // color has no quantity, thus user is trying to change quantity
    }
});

// Listen for when minus button is clicked
modalQuantityControlMinusButton.addEventListener("click", function(evt){
    if(records.selected.quantity + records.selected.change == 0) return; // if changes will lead to a negative value in quantity , stop

    // Otherwise, decrease quantity by one
    Object.assign(records.selected, {
        change: records.selected.change - 1, 
    });

    // if current changes has led to a quantity being zero
    if(records.selected.quantity + records.selected.change == 0){
        modalQuantityControlMinusButton.disabled = true; // disable the minus button
    }

    // update quantity control modal
    updateQuantityControlModal();
}, false);

// Listen for when plus button is clicked
modalQuantityControlPlusButton.addEventListener("click", function(evt){
    // increase quantity changes by one
    Object.assign(records.selected, {
        change: records.selected.change + 1,
    });

    // if current changes has led to a quantity being greater than zero
    if(records.selected.quantity + records.selected.change > 0){
        modalQuantityControlMinusButton.disabled = false; // enable the minus button
    }

    // update quantity control modal
    updateQuantityControlModal();
}, false);

// Listen for when user confirms quantity changes
confirmQuantityButton.addEventListener("click", function(){
    Object.assign(records.selected, {
        quantity: records.selected.quantity + records.selected.change,
        change: 0,
    });

    let matchFound = false;

    if(records.cart.length > 0){
        for(let i = 0; i < records.cart.length; i++){
            if(records.cart[i].value == records.selected.value){
                matchFound = true;
                if(records.selected.quantity == 0){
                    records.cart.splice(i, 1);
                }else{
                    records.cart[i] = Object.assign({}, records.selected);
                }
                
                break;
            }
        }
    }

    if(!matchFound && records.selected.quantity > 0){
        records.cart.push(Object.assign({}, records.selected));
    }

    if(records.selected.quantity > 0){
        checkoutButton.value = "Check out now";
    }else{
        checkoutButton.value = "Add to Cart";
    }

    checkoutQuantityInput.value = records.selected.quantity;
    createPurchasedItems();
    quantityControlModal.hide();
}, false);

// dynamically create the display of all colors that are added to the cart
const createPurchasedItems = function(){

    let id = records.selected.value.substr(1); // create an id out of the value of the color

    // find color from page
    let container = document.getElementById(id);

    // if color exists
    if(container){
        // delete everything inside
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }else{
        // Otherwise, create new div
        container = document.createElement('div');
        container.setAttribute("id", id); // set id
        container.classList.add("colors-container"); // add class
        purchasedItems.appendChild(container); // add to container to purchased items
    }

    // Create n colors, when n is equal to the quantity of the currently selected color
    for(let i = 0; i < parseInt(records.selected.quantity, 10); i++){

        let colorContainer = document.createElement('div'); // create color container div
        colorContainer.classList.add('color-container'); // add class
        
        let color = document.createElement('div'); // create color div
        color.classList.add('color'); // add class
        color.style.backgroundColor = records.selected.value; // set color background

        colorContainer.appendChild(color); // add color to color container
        container.appendChild(colorContainer); // add color container to  container
    }
};


// Listen for when procced to checkout button is clicked
proccedToCheckoutButton.addEventListener("click", function(){
    processControlModal.hide(); // hide process control modal
    
    let totalCost = 0; // initiall total cost
    
    // remove everything from line items 
    while(lineItems.firstChild){
        lineItems.removeChild(lineItems.firstChild);
    }
    
    // Loop through each item inside the cart
    records.cart.forEach(function(item){
        let lineItem = document.createElement("div"); // create line item div
        lineItem.classList.add('row', 'border-bottom', 'p-3'); // add classes
        
        // line item total cost
        let lineItemTotalCost = (item.quantity * item.price).toFixed(2);
        // add line item total cost to the overall total cost
        totalCost += parseFloat(lineItemTotalCost);
        
        // write line item html
        lineItem.innerHTML = '<div class="col-sm-3"><div class="color-container"><div class="color" style="background-color:' + item.value + ';"></div></div></div><div class="col-sm-9"><div class="row"><div class="col-12"><h4>' + item.name + '</h4></div><div class="col-6"><span class="checkout-modal-quantity-display">Qty: '+ item.quantity +'</span></div><div class="col-6 d-flex justify-content-end"><span class="checkout-modal-price-display">R ' + lineItemTotalCost +'</span></div></div></div>';
        
        // add line item to other line items inside the page
        lineItems.appendChild(lineItem);
    });
    
    document.querySelector("#checkoutModalTotalCostDisplay span").innerHTML = totalCost.toFixed(2); // update the displayed overall total cost in the modal
    
    checkoutModal.show(); // show check out modal
});

// Listen for when user indicates they want to change quantity
changeQuantityButton.addEventListener("click", function(){
    processControlModal.hide(); // hide process control modal
    quantityControlModal.show(); // show quantity control modal
});

// Listen for when quantity change are discarded
cancelQuantityChangeButton.addEventListener('click', function(){
    records.selected.change = 0; // set changes to zero
    updateQuantityControlModal(); // update quantity control modal
});

// Listen for when the final check out button is clicked
finalCheckoutButton.addEventListener("click", function(){
    location.reload(); // reload page
});

// function that is run to star everything
const init = function(){
    // select one color randomly
    colorPickerColors[Math.floor(Math.random() * colorPickerColors.length)].click();
};

init(); // start
