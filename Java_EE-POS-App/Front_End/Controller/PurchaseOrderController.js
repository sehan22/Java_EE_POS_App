var customerDB;
var itemDB;
var orderDB;

getCustomerDB();
getItemDB();
getOrderDB();

// get customer json data from CustomerServletAPI
function getCustomerDB() {
    $.ajax({
        url: 'http://localhost:8080/Back_End/pages/customer',
        dataType: "json",
        method: "GET",
        async: false,
        success: function (customers) {
            customerDB = customers;
            console.log(customerDB)

        },
        error: function (error) {
            alert('Error loading customers');
        }
    });
}

function getItemDB() {
    $.ajax({
        url: 'http://localhost:8080/Back_End/pages/item',
        dataType: "json",
        method: "GET",
        async: false,
        success: function (items) {
            itemDB = items;
            console.log(itemDB)
        },
        error: function (error) {
            alert('Error loading Items');
        }
    });
}

function getOrderDB() {
    $.ajax({
        url: 'http://localhost:8080/Back_End/pages/orders',
        dataType: "json",
        method: "GET",
        async: false,
        success: function (orders) {
            orderDB = orders;
            console.log(orderDB)
        },
        error: function (error) {
            alert('Error loading Orders');
        }
    });
}

////////////////////////////////////

//generate the next order ID
generateOrderID(getLastOrderID());

function getLastOrderID() {
    getOrderDB();

    if (orderDB.length > 0) {
        return orderDB[orderDB.length - 1].orderID;
    } else {
        return 'O00-001'; // Return if the orderDB is empty
    }
}

function generateOrderID(lastOrderID) {
    const lastOrderNumber = parseInt(lastOrderID.split('-')[1]);
    const nextOrderNumber = lastOrderNumber + 1;
    const paddedOrderNumber = String(nextOrderNumber).padStart(3, '0');
    const nextOrderID = `O00-${paddedOrderNumber}`;
    $('#txtOrderID').val(nextOrderID);
    return nextOrderID;
}

//////////////////////////////
// Get the current date
const currentDate = new Date();

// Format the current date as yyyy-MM-dd
const formattedDate = formatDate(currentDate);

$('#txtDate').val(formattedDate);

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//////////////////////////////
// load all customer IDs
loadAllCusIDs();

var selectCusElement;

function loadAllCusIDs() {
    selectCusElement = document.getElementById("selectCusID");

    // Clear all existing options
    while (selectCusElement.firstChild) {
        selectCusElement.removeChild(selectCusElement.firstChild);
    }

    customerDB.forEach(function (customer) {
        var optionElement = document.createElement("option");
        optionElement.value = customer.id;
        optionElement.textContent = customer.id;
        selectCusElement.appendChild(optionElement);
    });

    $('#selectCusID').val('');
}

// Add event listener to the select element
selectCusElement.addEventListener("change", function () {
    let selectedCustomerId = selectCusElement.value;
    let selectedCustomer = customerDB.find(function (customer) {
        return customer.id === selectedCustomerId;
    });

    if (selectedCustomer) {
        $('#orderCustomerName').val(selectedCustomer.name);
        $('#orderCustomerAddress').val(selectedCustomer.address);
    } else {
        $('#orderCustomerName').val("");
        $('#orderCustomerAddress').val("");
    }
});

/////////////////////////////////////////////
// Load all item codes
loadAllItemCodes();

var selectCodeElement;

function loadAllItemCodes() {
    selectCodeElement = document.getElementById("selectItemCode");

    // Clear all existing options
    while (selectCodeElement.firstChild) {
        selectCodeElement.removeChild(selectCodeElement.firstChild);
    }

    // Add data from the itemDB array
    itemDB.forEach(function (item) {
        var optionElement = document.createElement("option");
        optionElement.value = item.code;
        optionElement.textContent = item.code;
        selectCodeElement.appendChild(optionElement);
    });

    $('#selectItemCode').val('');
}

// Add event listener to the select element
selectCodeElement.addEventListener("change", function () {
    var selectedCode = selectCodeElement.value;
    var selectedItem = itemDB.find(function (item) {
        return item.code === selectedCode;
    });

    if (selectedItem) {
        $('#txtItemName').val(selectedItem.itemName);
        $('#txtItemPrice').val(selectedItem.unitPrice);
        $('#txtQTYOnHand').val(selectedItem.qty);

    } else {
        $('#txtItemName').val("");
        $('#txtItemPrice').val("");
        $('#txtQTYOnHand').val("");
    }
});

///////////////////////////////////////////////
// Calculate total
var orderQtyInput = $("#txtQty");

orderQtyInput.on("keyup", function () {
    var price = parseFloat($('#txtItemPrice').val());
    var orderQty = parseInt($("#txtQty").val());

    if (!isNaN(price) && !isNaN(orderQty) && isValidOrderItemQty) {
        var total = price * orderQty;
        $("#TotalOfItem").val(total.toFixed(2));
    } else {
        $("#TotalOfItem").val("");
    }
});

////////////////////////////////////////////////
let cart = [];

$('#addToCart').click(function () {
    // Get the item details
    let itemCode = $('#selectItemCode').val();
    let itemName = $('#txtItemName').val();
    let price = $('#txtItemPrice').val();
    let quantity = parseInt($('#txtQty').val()); // Convert to number
    let total = parseFloat(price) * quantity; // Convert to number

    // Check if the item already exists in the cart
    let existingItem = cart.find(function (item) {
        return item.itemCode === itemCode;
    });

    if (existingItem && isValidOrderItemQty) {
        // Update the quantity and total of the existing item
        existingItem.quantity += quantity;
        existingItem.total += total;
    } else {
        // Create a new cart item object
        let cartItem = {
            itemCode: itemCode,
            itemName: itemName,
            price: price,
            quantity: quantity,
            total: total
        };

        // Add the cart item to the cart array
        if (isValidOrderItemQty) {
            cart.push(cartItem);
        } else {
            $('#txtQty').focus();
            return; // Exit the function without displaying the cart items
        }
    }

    // Display the cart items in the table
    displayCartItems();

    // clear qty and total
    $('#txtQty').val("");
    $('#TotalOfItem').val("");

    isValidOrderItemQty = false;

});

//add to table
function displayCartItems() {
    // Clear the table body
    $('#cart').empty();

    // Iterate over the cart items and add rows to the table
    cart.forEach(function (item) {
        let row = '<tr>' +
            '<td>' + item.itemCode + '</td>' +
            '<td>' + item.itemName + '</td>' +
            '<td>' + item.price + '</td>' +
            '<td>' + item.quantity + '</td>' +
            '<td>' + item.total + '</td>' +
            '</tr>';

        $('#cart').append(row);
    });

    calculateTotal();
    updateGrandTotal();
}


// load selected row to fields
$('#cart').on('click', 'tr', function () {
    // Get the data from the clicked row
    let itemCode = $(this).find('td:eq(0)').text();
    let itemName = $(this).find('td:eq(1)').text();
    let price = $(this).find('td:eq(2)').text();
    let quantity = $(this).find('td:eq(3)').text();

    // Populate the input fields with the data
    $('#selectItemCode').val(itemCode);
    $('#txtItemName').val(itemName);
    $('#txtItemPrice').val(price);
    $('#txtQTYOnHand').val(quantity);
});

// Row selection
$('#cart').on('click', 'tr', function () {
    $(this).toggleClass('selected');
});

// Remove selected row
$('#RemoveSelected').click(function () {
    // Get the selected row
    let selectedRow = $('#cart tr.selected');

    if (selectedRow.length > 0) {
        // Get the index of the selected row within the table
        let selectedRowIndex = selectedRow.index();

        // Remove the selected row from the table
        selectedRow.remove();

        // Remove the corresponding item from the cart array
        cart.splice(selectedRowIndex, 1);
        calculateTotal();
        updateGrandTotal();
    }
});

// get total
calculateTotal();

function calculateTotal() {
    var tot = 0;

    // Iterate over each row in the table
    $('#cart tr').each(function () {
        // Get the value of the "Total" column in the current row
        let rowTotal = parseFloat($(this).find('td:eq(4)').text());

        // Add the row total to the overall total
        tot += rowTotal;
    });

    // Update the total field with the calculated total
    $('#total').text((tot.toFixed(2)));
}

// grand total
// Keyup event handlers for cash and discount inputs
$('#txtCash, #txtDiscount').on('keyup', function () {
    updateGrandTotal();
    checkCashValidity();
});

function updateGrandTotal() {
    // Get the values of cash, total, and discount
    let cash = parseFloat($('#txtCash').val()) || 0;
    let total = parseFloat($('#total').text()) || 0;
    let discount = parseFloat($('#txtDiscount').val()) || 0;

    // Calculate the grand total
    let grandTotal = total - total * (discount / 100);
    let rest = cash - grandTotal;

    // Update the grand total input field
    $('#subtotal').text(grandTotal.toFixed(2));
    $('#txtBalance').val(rest.toFixed(2));
}

///////////////////////////////////////////
// place order
$('#placeOrder').click(function () {
    if (checkIsValidOrder()) {
        placeOrder();
        changeTextFieldColorsToBack([$('#txtCash'), $('#txtQty')]);
    } else {
        alert("Invalid Order!");
    }
});

function placeOrder() {
    // Retrieve values from input fields
    let orderID = $('#txtOrderID').val();
    let date = $('#txtDate').val();
    let customerID = $('#selectCusID').val();
    let discount = parseFloat($('#txtDiscount').val());
    let total = $('#total').text();

    // Create the cart array
    let cart2 = [];
    // Iterate over the selected items in the table and add them to the cart
    $('#cart tr').each(function () {
        let itemCode = $(this).find('td:first-child').text();
        let quantity = parseInt($(this).find('td:nth-child(4)').text());
        let item = itemDB.find(item => item.code === itemCode);
        if (item) {
            cart2.push({
                item: item,
                qty: quantity
            });
        }
    });

    // Find the customer object based on the customerID
    let customer = customerDB.find(customer => customer.id === customerID);

    // Create the new order object
    let order = {
        'orderID': orderID,
        'date': date.toString(),
        'customer': customer,
        'cart': cart2,
        'discount': discount.toString(),
        'total': total.toString()
    };

    console.log(order)

    // send order object to save in server
    $.ajax({
        url: 'http://localhost:8080/Back_End/pages/purchase-order',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(order),
        async:false,

        success: function (res) {
            alert(res.message);
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });

    // Push the order object into the orderDB array
    //  orderDB.push(order);
    //console.log(orderDB);
    //alert("Order successfully placed!")

    clearPlaceOrderFields();

    // empty cart
    cart2 = [];
    cart = [];
}

function clearPlaceOrderFields() {
    // Clear the input fields.
    $('#selectCusID').val('');
    $('#orderCustomerName').val('');
    $('#orderCustomerAddress').val('');

    $('#selectItemCode').val('');
    $('#txtItemName').val('');
    $('#txtQTYOnHand').val('');
    $('#txtItemPrice').val('');
    $('#txtQty').val('');
    $('#TotalOfItem').val('');

    $('#discount').val('');
    $('#total').text('00.0');
    $('#txtCash').val('');
    $('#subtotal').text('00.0');
    $('#txtBalance').val('');

    // Clear the table body
    $('#cart').empty();

    generateOrderID(getLastOrderID());
}