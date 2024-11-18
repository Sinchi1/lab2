<%@ page import="java.util.ArrayList" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>


<html>
<head>
    <link rel="stylesheet" href="index.css">
    <script defer src="index.js"></script>
</head>
<body onload="
    <%
    ArrayList<String> tableValues = (ArrayList<String>) session.getAttribute("values");
    if (tableValues == null){
        tableValues = new ArrayList<>();
    }

    String result = (String) session.getAttribute("res");
    if (result != null ){
        tableValues.add(result);
        tableValues.add((String) session.getAttribute("x"));
        tableValues.add((String) session.getAttribute("y"));
        tableValues.add((String) session.getAttribute("r"));
        session.setAttribute("res", null);
    }

    session.setAttribute("tableValues", tableValues);
		if(tableValues.size() > 0){
            for(int i=0; i < tableValues.size(); i+=4){
                    result = tableValues.get(i);
                	String x = tableValues.get(i+1);
		            String y = tableValues.get(i+2);
		            String r = tableValues.get(i+3);
%>
        updateTable('<%= result %>', '<%= x %>', '<%= y %>', '<%= r %>')
    <%          }
        }
%>
        ">
<header class="header">Трусковский Георгий 413818 Р3214</header>

<div class="container">
    <div class="elements-item">
<%--Needed second commit first attempt failed lol--%>
        <form action="http://localhost:8080/lab2-1.0-SNAPSHOT/control" method="get" onsubmit="return dataTransfer()">

            <p>Выберите X:</p>
            <div id="coord-x" >
                <label><input type="checkbox" name="x" value="-2">-2</label>
                <label><input type="checkbox" name="x" value="-1.5">-1.5</label>
                <label><input type="checkbox" name="x" value="-1">-1</label>
                <br>
                <label><input type="checkbox" name="x" value="-0.5">-0.5</label>
                <label><input type="checkbox" name="x" value="0">0</label>
                <label><input type="checkbox" name="x" value="0.5">0.5</label>
                <br>
                <label><input type="checkbox" name="x" value="1">1</label>
                <label><input type="checkbox" name="x" value="1.5">1.5</label>
                <label><input type="checkbox" name="x" value="2">2</label>
            </div>

            <p>
                y - координата точки по оси oy (от -3 до 5)<br>
                <input type="text" id="y" name="y" placeholder="[-3..5]">
                <label for="y" class="error" id="y_error"></label>
            </p>

            <p>
                R - величина R на графике (от 1 до 3)<br>
                <select name="r" id="r">
                    <option value="">Выберите значение</option>
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                </select>
                <label for="R" class="error" id="R_error"></label>
            </p>
            <p>
                <input type="submit" value="Подтвердить" id="confirm">
            </p>
        </form>
    </div>

    <div class="elements-item">

        <div id="center_graphic" class="column">
            <svg width="300" height="300" id="graph" >
                <rect x="150" y="90" width="120" height="60" fill="lightblue"></rect>
                <polygon points="150,150 150,90 30,150" fill="lightblue"></polygon>
                <path d="M90 150
                    A 60 60, 0, 0, 0, 150 210
                    L 150 150 Z"
                      fill="lightblue" stroke="none"></path>
                <line x1="150" y1="0" x2="150" y2="300" stroke="black"></line>
                <line x1="300" y1="150" x2="290" y2="155" stroke="black"></line>
                <line x1="300" y1="150" x2="290" y2="145" stroke="black"></line>
                <line x1="0" y1="150" x2="300" y2="150" stroke="black"></line>
                <line x1="150" y1="0" x2="145" y2="10" stroke="black"></line>
                <line x1="150" y1="0" x2="155" y2="10" stroke="black"></line>
                <line x1="210" y1="145" x2="210" y2="155" stroke="black"></line>
                <line x1="270" y1="145" x2="270" y2="155" stroke="black"></line>
                <line x1="90" y1="145" x2="90" y2="155" stroke="black"></line>
                <line x1="30" y1="145" x2="30" y2="155" stroke="black"></line>
                <line x1="145" y1="270" x2="155" y2="270" stroke="black"></line>
                <line x1="145" y1="210" x2="155" y2="210" stroke="black"></line>
                <line x1="145" y1="90" x2="155" y2="90" stroke="black"></line>
                <line x1="145" y1="30" x2="155" y2="30" stroke="black"></line>
                <text x="280" y="145" fill="black">x</text>
                <text x="155" y="10" fill="black">y</text>
                <circle cx="150" cy="150" r="0" fill="red"></circle>
            </svg>
        </div>
    </div>

    <div class="elements-item">

        <div id="right_table" class="column">
            <table id="results">
                <caption>Результаты</caption>
                <thead>
                <tr>
                    <th scope="col">№</th>
                    <th scope="col">Попадание</th>
                    <th scope="col">x</th>
                    <th scope="col">y</th>
                    <th scope="col">r</th>
                </tr>
                </thead>
                <tbody>
                <%
                    int counter = 1;
                    for (int i = 0; i < tableValues.size(); i += 4) {
                %>
                <tr>
                    <td><%= counter++ %></td>
                    <td><%= tableValues.get(i) %></td>
                    <td><%= tableValues.get(i + 1) %></td>
                    <td><%= tableValues.get(i + 2) %></td>
                    <td><%= tableValues.get(i + 3) %></td>
                </tr>
                <% } %>
                </tbody>
            </table>
        </div>

    </div>
</div>
</body>
</html>
