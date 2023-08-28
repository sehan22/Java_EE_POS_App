package lk.ijse.jsp.servlet;

import lk.ijse.jsp.servlet.util.DBConnection;

import javax.json.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = {"/pages/customer"})
public class CustomerServletAPI extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            resp.addHeader("Access-Control-Allow-Origin", "*");

            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("select * from customer");
            ResultSet rst = pstm.executeQuery();

            JsonArrayBuilder allCustomers = Json.createArrayBuilder();
            while (rst.next()) {
                String id = rst.getString(1);
                String name = rst.getString(2);
                String address = rst.getString(3);

                JsonObjectBuilder customerObject = Json.createObjectBuilder();
                customerObject.add("id", id);
                customerObject.add("name", name);
                customerObject.add("address", address);
                allCustomers.add(customerObject.build());
            }

            resp.getWriter().print(allCustomers.build());

        } catch (ClassNotFoundException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(500);

        } catch (SQLException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(400);
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String cusID = req.getParameter("cusID");
        String cusName = req.getParameter("cusName");
        String cusAddress = req.getParameter("cusAddress");

        resp.addHeader("Content-Type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        try {
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("insert into customer values(?,?,?)");

            pstm.setObject(1, cusID);
            pstm.setObject(2, cusName);
            pstm.setObject(3, cusAddress);

            if (pstm.executeUpdate() > 0) {
                showMessage(resp, cusID + " Successfully Added..!", "ok", "[]");
                resp.setStatus(200);
            } else {
                showMessage(resp, "Wrong data", "error", "[]");
                resp.setStatus(400);
            }

        } catch (ClassNotFoundException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(500);

        } catch (SQLException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(400);
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        JsonReader reader = Json.createReader(req.getReader());
        JsonObject jsonObject = reader.readObject();

        String cusID = jsonObject.getString("cusID");
        String cusName = jsonObject.getString("cusName");
        String cusAddress = jsonObject.getString("cusAddress");

        resp.addHeader("Content-Type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        try {
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm3 = connection.prepareStatement("update customer set cusName=?,cusAddress=? where cusID=?");

            pstm3.setObject(3, cusID);
            pstm3.setObject(1, cusName);
            pstm3.setObject(2, cusAddress);

            if (pstm3.executeUpdate() > 0) {
                showMessage(resp, cusID + " Customer Updated..!", "ok", "[]");
                resp.setStatus(200);
            } else {
                showMessage(resp, cusID + " Customer is not exist..!", "error", "[]");
                resp.setStatus(400);
            }

        } catch (ClassNotFoundException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(500);

        } catch (SQLException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(400);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String cusID = req.getParameter("cusID");
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");

        try {
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("delete from customer where cusID=?");
            pstm.setObject(1, cusID);

            if (pstm.executeUpdate() > 0) {
                showMessage(resp, cusID + " Customer Deleted..!", "ok", "[]");
                resp.setStatus(200);
            } else {
                showMessage(resp, "Customer with ID " + cusID + " not found.", "error", "[]");
                resp.setStatus(400);
            }

        } catch (ClassNotFoundException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(500);

        } catch (SQLException e) {
            showMessage(resp, e.getMessage(), "error", "[]");
            resp.setStatus(400);
        }
    }

    private void showMessage(HttpServletResponse resp, String message, String state, String data) throws IOException {
        JsonObjectBuilder response = Json.createObjectBuilder();
        response.add("state", state);
        response.add("message", message);
        response.add("data", data);
        resp.getWriter().print(response.build());
    }

    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp) {
        resp.addHeader("Access-Control-Allow-Origin", "*");
        resp.addHeader("Access-Control-Allow-Methods", "PUT");
        resp.addHeader("Access-Control-Allow-Methods", "DELETE");
        resp.addHeader("Access-Control-Allow-Headers", "Content-type");
    }
}



