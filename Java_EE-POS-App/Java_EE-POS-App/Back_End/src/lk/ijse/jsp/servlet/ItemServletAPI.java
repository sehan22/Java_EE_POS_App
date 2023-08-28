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

@WebServlet(urlPatterns = "/pages/item")
public class ItemServletAPI extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        try {
            resp.addHeader("Access-Control-Allow-Origin", "*");

            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("select * from Item");
            ResultSet rst = pstm.executeQuery();

            JsonArrayBuilder allItems = Json.createArrayBuilder();
            while (rst.next()) {
                String code = rst.getString(1);
                String itemName = rst.getString(2);
                int qty = rst.getInt(3);
                double unitPrice = rst.getDouble(4);

                JsonObjectBuilder itemObject = Json.createObjectBuilder();
                itemObject.add("code", code);
                itemObject.add("itemName", itemName);
                itemObject.add("qty", qty);
                itemObject.add("unitPrice", unitPrice);
                allItems.add(itemObject.build());
            }

            resp.getWriter().print(allItems.build());

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
        String code = req.getParameter("code");
        String itemName = req.getParameter("description");
        String qty = req.getParameter("qty");
        String unitPrice = req.getParameter("unitPrice");

        resp.addHeader("Content-Type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        try {
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("insert into Item values(?,?,?,?)");

            pstm.setObject(1, code);
            pstm.setObject(2, itemName);
            pstm.setObject(3, qty);
            pstm.setObject(4, unitPrice);

            if (pstm.executeUpdate() > 0) {
                showMessage(resp, code + " Successfully Added..!", "ok", "[]");
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

        String code = jsonObject.getString("code");
        String itemName = jsonObject.getString("itemName");
        String qty = jsonObject.getString("qty");
        String unitPrice = jsonObject.getString("unitPrice");

        resp.addHeader("Content-Type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");
        try {
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm3 = connection.prepareStatement("update Item set itemName=?,qty=?,unitPrice=? where code=?");

            pstm3.setObject(1, itemName);
            pstm3.setObject(2, qty);
            pstm3.setObject(3, unitPrice);
            pstm3.setObject(4, code);

            if (pstm3.executeUpdate() > 0) {
                showMessage(resp, code + " Item Updated..!", "ok", "[]");
                resp.setStatus(200);
            } else {
                showMessage(resp, code + " Item is not exist..!", "error", "[]");
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
        String code = req.getParameter("code");
        resp.addHeader("Content-type", "application/json");
        resp.addHeader("Access-Control-Allow-Origin", "*");

        try{
            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("delete from Item where code=?");
            pstm.setObject(1, code);
            resp.addHeader("Content-Type", "application/json");

            if (pstm.executeUpdate() > 0) {
                showMessage(resp, code + " Item Deleted..!", "ok", "[]");
                resp.setStatus(200);
            } else {
                showMessage(resp, "Item with code " + code + " not found.", "error", "[]");
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
