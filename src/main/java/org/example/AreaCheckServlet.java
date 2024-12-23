package org.example;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.Link;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.LinkedList;

@WebServlet(name = "AreaCheckServlet", value = "/Check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        long time = 0;

//        double[] x = new double[0];
        String xValues = (String) req.getSession().getAttribute("x");
        String[] valueStrings = xValues.split(",");
        LinkedList<Double> x = new LinkedList<>();
        for (String value : valueStrings) {
            x.add(Double.parseDouble(value));
        }

        Double y = Double.parseDouble((String) req.getSession().getAttribute("y"));
        Double r = Double.parseDouble((String) req.getSession().getAttribute("r"));
        LinkedList<Object[]> results = new LinkedList<>();
        for (Double xi : x) {
            Boolean isHit = checkCircle(xi, y, r) || checkTriangle(xi, y, r) || checkSquare(xi, y, r);
            results.add(new Object[]{isHit.toString(),xi.toString(), req.getSession().getAttribute("y"), r.toString(), LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss"))});
        }

        // Сохраняем результаты в сессии
        req.getSession().setAttribute("results", results);

        // Перенаправляем на index.jsp
        resp.sendRedirect(req.getContextPath() + "/index.jsp");

    }



    // Поправить формулы
    public boolean checkCircle(double x, double y, double r) {
        return (((x*x+y*y)<=Math.pow((r),2) && (x<=0)) && (y<=0));
    }


    public boolean checkTriangle(double x, double y, double r) {
        return (( (-y > -x-r/2) && (y >= 0) && (x <= 0) ));
    }


    public boolean checkSquare(double x, double y, double r) {
        return (( 0<=x && x<=r) &&(0<=y && y<=r));
    }
}

