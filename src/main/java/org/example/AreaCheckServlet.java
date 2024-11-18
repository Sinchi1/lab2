package org.example;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "AreaCheckServlet", value = "/Check")
public class AreaCheckServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {

        double x = Double.parseDouble((String) req.getSession().getAttribute("x"));
        double y = Double.parseDouble((String) req.getSession().getAttribute("y"));
        double r = Double.parseDouble((String) req.getSession().getAttribute("r"));

        boolean isHit = (checkCircle(x,y,r) || checkTriangle(x,y,r) || checkSquare(x,y,r));

        req.getSession().setAttribute("res", String.valueOf(isHit));
        try {
            resp.sendRedirect(req.getContextPath() + "/index.jsp");
        } catch (IOException e) {
            e.printStackTrace();
            resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Редирект результата не удался");
        }
    }


    // Поправить формулы
    public boolean checkCircle(double x, double y, double r) {
        return (((x*x+y*y)<=Math.pow((r),2) && (x<=0)) && (y>=0));
    }


    public boolean checkTriangle(double x, double y, double r) {
        return (( (y > -x-r) && (y <= 0) && (x <= 0) ));
    }


    public boolean checkSquare(double x, double y, double r) {
        return (( 0<=x && x<=r/2) &&(0<=y && y<=r));
    }
}
