package lk.ijse.jsp.servlet;

import lk.ijse.jsp.servlet.util.DBConnection;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@WebServlet(urlPatterns = {"/pages/orders"})
public class OrdersServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            resp.addHeader("Access-Control-Allow-Origin", "*");

            Connection connection = DBConnection.getDBConnection().getConnection();
            PreparedStatement pstm = connection.prepareStatement("SELECT\n" +
                    "    o.orderID,\n" +
                    "    o.date,\n" +
                    "    o.customerID,\n" +
                    "    GROUP_CONCAT(oi.itemID ORDER BY oi.itemID) AS itemsIDs,\n" +
                    "    o.discount,\n" +
                    "    o.total\n" +
                    "FROM orders o\n" +
                    "         JOIN order_items oi ON o.orderID = oi.orderID\n" +
                    "GROUP BY o.orderID;");
            ResultSet rst = pstm.executeQuery();

            JsonArrayBuilder allOrders = Json.createArrayBuilder();
            while (rst.next()) {
                String orderID = rst.getString(1);
                String date = rst.getString(2);
                String customerID = rst.getString(3);
                String itemsIDs = rst.getString(4);
                String discount = rst.getString(5);
                String total = rst.getString(6);

                JsonObjectBuilder orderObject = Json.createObjectBuilder();
                orderObject.add("orderID", orderID);
                orderObject.add("date", date);
                orderObject.add("customerID", customerID);
                orderObject.add("itemsIDs", itemsIDs);
                orderObject.add("discount", discount);
                orderObject.add("total", total);
                allOrders.add(orderObject.build());
            }

            resp.getWriter().print(allOrders.build());

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
}
