let baseUrl = 'http://localhost:8080/Back_End/pages/';

getAllCustomers();
bindRowClickEvents();

$("#btnGetAll").click(function () {
    getAllCustomers();
});

function getAllCustomers() {
    $("#tblCustomer").empty();

    $.ajax({
        url: baseUrl + 'customer',
        dataType: "json",
        method: "GET",
        success: function (customers) {
            for (let i in customers) {
                let cus = customers[i];
                let id = cus.id;
                let name = cus.name;
                let address = cus.address;
                let row = `<tr><td>${id}</td><td>${name}</td><td>${address}</td></tr>`;
                $("#tblCustomer").append(row);
            }
            setTextFields("", "", "");
        },
        error: function (error) {
            alert(error.responseJSON.message);
            setTextFields("", "", "");
        }
    });
}

// bind table row values to text field on click
function bindRowClickEvents() {
    $('#tblCustomer').on('click', 'tr', function () {
        let id = $(this).find('td:eq(0)').text();
        let name = $(this).find('td:eq(1)').text();
        let address = $(this).find('td:eq(2)').text();

        setTextFields(id, name, address);
    });
}

// set text fields
function setTextFields(id, name, address) {
    $('#txtCustomerID').val(id);
    $('#txtCustomerName').val(name);
    $('#txtCustomerAddress').val(address);
}

$("#btnClear").click(function () {
    setTextFields("", "", "");
});

// add
$("#btnCustomer").click(function () {
    let formData = $("#customerForm").serialize();

    $.ajax({
        url: baseUrl + 'customer',
        method: "POST",
        data: formData,
        success: function (res) {
            alert(res.message);
            getAllCustomers();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});

// delete
$("#btnCusDelete").click(function () {
    let id = $('#txtCustomerID').val();

    $.ajax({
        url: baseUrl + 'customer?cusID='+ id,
        method: 'DELETE',

        success: function (res) {
            alert(res.message);
            getAllCustomers();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});

// update
$("#btnUpdate").click(function () {
    let id = $('#txtCustomerID').val();
    let name = $('#txtCustomerName').val();
    let address = $('#txtCustomerAddress').val();

    let customer = {
        "cusID": id,
        "cusName": name,
        "cusAddress": address
    }

    $.ajax({
        url: baseUrl + 'customer',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(customer),

        success: function (res) {
            alert(res.message);
            getAllCustomers();
        },
        error: function (error) {
            alert(error.responseJSON.message);
        }
    });
});

