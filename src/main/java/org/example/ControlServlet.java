package org.example;

import jakarta.servlet.ServletContext;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet(name = "ControlServlet", value = "/control")
public class ControlServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        if(req.getMethod().equalsIgnoreCase("GET")){
            ServletContext context = getServletContext();
            context.setAttribute("x",req.getParameter("x"));
            context.setAttribute("y",req.getParameter("y"));
            context.setAttribute("r",req.getParameter("r"));
            try {
                resp.sendRedirect(req.getContextPath() + "/check");
            } catch (IOException e) {
                e.printStackTrace();
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "По какой-то причине не удалось проверить попадание");
            }
        }
        else {
            req.getSession().setAttribute("errorMessage", "Сервер принимает только GET запросы");
            resp.sendRedirect(req.getContextPath() + "/error.jsp");
        }
    }
}