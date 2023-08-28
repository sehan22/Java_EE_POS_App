let baseUrl = 'http://localhost:8080/Back_End/pages/';

getAllItems();
bindRowClickEvents()

$("#btnGetAllItems").click(function () {
    getAllItems();
});

function getAllItems() {
    $("#tblItem").empty();

    $.ajax({
        url: baseUrl + 'item',
        dataType: "json",
        method: "GET",
        success: function (items) {
            for (let i in items) {
                let item = items[i];
                let code = item.code;
                let name = item.itemName;
                let qtyOnHand = item.qty;
                let unitPrice = item.unitPrice;
                let row = `<tr><td>${code}</td><td>${name}</td><td>${qtyOnHand}</td><td>${unitPrice}</td></tr>`;
                $("#tblItem").append(row);
            }
            setTextFields("", "", "", "");
        },
        error: function (error) {
            alert(error.responseJSON.message);
            setTextFields("", "", "", "");
        }
    });
}

// bind table row values to text field on click
function bindRowClickEvents() {
    $('#tblItem').on('click', 'tr', function () {
        let code = $(this).find('td:eq(0)').text();
        let name = $(this).find('td:eq(1)').text();
        let qtyOnHand = $(this).find('td:eq(2)').text();
        let unitPrice = $(this).find('td:eq(2)').text();

        setTextFields(code, name, qtyOnHand, unitPrice);
    });
}

// set text fields
function setTextFields(code, name, qtyOnHand, unitPrice) {
    $('#itemCode').val(code);
    $('#itemName').val(name);
    $('#itemQty').val(qtyOnHand);
    $('#itemPrice').val(unitPrice);
}

$("#btnClear").click(function () {
    setTextFields("", "", "", "");
});

// add
$("#btnItem").click(function () {
    let formData = $("#itemForm").serialize();

    $.ajax({
        url: baseUrl + "item",
        method: "POST",
        data: formData,
        success: function (res) {
            alert(res.message);
            getAllItems();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});

// delete
$("#btnItemDelete").click(function () {
    let code = $('#itemCode').val();

    $.ajax({
        url: baseUrl + "item?code=" + code,
        method: "DELETE",

        success: function (res) {
            alert(res.message);
            getAllItems();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});

// update
$("#btnItemUpdate").click(function () {
    let code = $('#itemCode').val();
    let itemName = $('#itemName').val();
    let qty = $('#itemQty').val();
    let unitPrice = $('#itemPrice').val();

    let item = {
        "code": code,
        "itemName": itemName,
        "qty": qty,
        "unitPrice": unitPrice
    }

    $.ajax({
        url: baseUrl + "item",
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(item),

        success: function (res) {
            alert(res.message);
            getAllItems();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});