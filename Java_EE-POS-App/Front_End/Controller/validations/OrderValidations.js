let isValidOrderItemQty = false;
let orderItemQtyField = $('#txtQty');
let orderItemQtyOnH = $('#txtQTYOnHand');

// regex pattern
let regexItemQty = /^(?!0+(\.0+)?$)\d+(\.\d{1,2})?$/;

orderItemQtyField.on('keyup', function () {
    let enteredQty = parseInt(orderItemQtyField.val());
    let availableQty = parseInt(orderItemQtyOnH.val());

    isValidOrderItemQty = isValid(regexItemQty, orderItemQtyField.val()) && (enteredQty <= availableQty);

    changeTextFieldColors(orderItemQtyField, isValidOrderItemQty);
});

let valid;

function checkCashValidity() {
    let restValue = parseFloat($('#txtBalance').val());

    valid = restValue >= 0;

    changeTextFieldColors($('#txtCash'), valid);
}

function checkIsValidOrder() {
    if (valid) {
        return true;
    } else {
        return false;
    }
}
