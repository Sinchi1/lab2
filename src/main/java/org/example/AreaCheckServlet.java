package org.example;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

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

        double y = Double.parseDouble((String) req.getSession().getAttribute("y"));
        double r = Double.parseDouble((String) req.getSession().getAttribute("r"));
        for (int i = 0; i < x.size(); ++i){
            boolean isHit = (checkCircle(x.get(i),y,r) || checkTriangle(x.get(i),y,r) || checkSquare(x.get(i),y,r));
            req.getSession().setAttribute("time",LocalDateTime.now().format(DateTimeFormatter.ofPattern("hh:mm:ss")));
            req.getSession().setAttribute("result", String.valueOf(isHit));
            try {
                resp.sendRedirect(req.getContextPath() + "/index.jsp");
            } catch (IOException e) {
                e.printStackTrace();
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Редирект результата не удался");
            }
        }
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
