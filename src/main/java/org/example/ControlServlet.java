package org.example;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedList;
import java.util.Objects;

@WebServlet(name = "ControlServlet", value = "/control")
public class ControlServlet extends HttpServlet {

    @Override
    protected void service(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        if(req.getMethod().equalsIgnoreCase("GET")){
            if (req.getParameter("x") == null || req.getParameter("y") == null || req.getParameter("r") == null){
                resp.sendRedirect(req.getContextPath() + "/index.jsp");
            }

            req.getSession().setAttribute("x", req.getParameter("x"));
            req.getSession().setAttribute("y", req.getParameter("y"));
            req.getSession().setAttribute("r", req.getParameter("r"));
            try {
                resp.sendRedirect(req.getContextPath() + "/Check");
            } catch (IOException e) {
                e.printStackTrace();
                resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "По какой-то причине не удалось проверить попадание");
            }
        } else if ((req.getMethod().equalsIgnoreCase("GET") && (Objects.equals(req.getContextPath(), "/index.jsp")))){
            RequestDispatcher dispatcher = req.getRequestDispatcher("/index.jsp");
            dispatcher.forward(req, resp);

        } else if (!req.getMethod().equalsIgnoreCase("GET")) {
            req.getSession().setAttribute("errorMessage", "Сервер принимает только GET запросы");
        }


    }
}