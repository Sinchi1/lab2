<%@ page import="java.util.ArrayList" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <link rel="stylesheet" href="index.css">
    <script defer src="index.js"></script>
</head>
<body>
<%
    ArrayList<String> values = (ArrayList<String>) session.getAttribute("values");
    if (values == null) {
        values = new ArrayList<>();
    }

    String result = (String) session.getAttribute("result");
    if (result != null) {
        values.add(result);
        values.add((String) session.getAttribute("x"));
        values.add((String) session.getAttribute("y"));
        values.add((String) session.getAttribute("r"));
        values.add((String) session.getAttribute("time"));
        session.setAttribute("result", null);
    }

    session.setAttribute("values", values);
%>

<header class="header">Трусковский Георгий 413818 Р3214</header>

<div class="container">
    <!-- Форма ввода -->
    <div class="elements-item">
        <form action="http://localhost:8080/lab2-1.0-SNAPSHOT/control" method="get" id="form">
            <p>Выберите X:</p>
            <div id="x">
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
            <div class="error" id="x_error"></div>

            <p>
                y - координата точки по оси oy (от -5 до 3)<br>
                <input type="text" id="y" name="y" placeholder="[-5..3]">
                <label for="y" class="error" id="y_error"></label>
            </p>

            <p>
                R - величина R на графике (от 1 до 5)<br>
                <select name="r" id="r" onchange="
                        if(RInput.value >= 1 && RInput.value <= 3 ){
                        let dots = document.getElementsByClassName('tmpDot');
                        while(dots[0]) {
                        dots[0].parentNode.removeChild(dots[0]);
                        }
                    <%
                        for(int i = 0; i < values.size(); i+=5){
                            %>
                        addDot(<%= values.get(i + 1) %>, <%= values.get(i + 2) %>, RInput.value)
                    <%
                        }
%>
                        }">">
                    <option value="">Выберите значение</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <label for="R" class="error" id="r_error"></label>
            </p>
            <p>
                <input type="submit" value="Подтвердить" id="confirm">
            </p>
        </form>
    </div>

    <!-- График -->
    <div class="elements-item">
        <div id="center_graphic" class="column">
            <svg width="300" height="300" id="graph" class="">
                <!-- Оси -->
                <line x1="150" y1="0" x2="150" y2="300" stroke="black" stroke-width="2"></line> <!-- Вертикальная ось -->
                <line x1="0" y1="150" x2="300" y2="150" stroke="black" stroke-width="2"></line> <!-- Горизонтальная ось -->

                <!-- Стрелки на осях -->
                <line x1="150" y1="0" x2="145" y2="10" stroke="black" stroke-width="2"></line> <!-- Верхняя стрелка -->
                <line x1="150" y1="0" x2="155" y2="10" stroke="black" stroke-width="2"></line>

                <line x1="300" y1="150" x2="290" y2="145" stroke="black" stroke-width="2"></line> <!-- Правая стрелка -->
                <line x1="300" y1="150" x2="290" y2="155" stroke="black" stroke-width="2"></line>

                <!-- Подписи на осях -->
                <text x="160" y="10" font-size="12" fill="black">Y</text>
                <text x="290" y="140" font-size="12" fill="black">X</text>

                <!-- Подписи делений -->
                <text x="140" y="35" font-size="10" fill="black">R</text>
                <text x="140" y="85" font-size="10" fill="black">R/2</text>
                <text x="140" y="215" font-size="10" fill="black">-R/2</text>
                <text x="140" y="265" font-size="10" fill="black">-R</text>

                <text x="215" y="165" font-size="10" fill="black">R/2</text>
                <text x="265" y="165" font-size="10" fill="black">R</text>
                <text x="85" y="165" font-size="10" fill="black">-R/2</text>
                <text x="35" y="165" font-size="10" fill="black">-R</text>

                <!-- Сектор (четверть круга) -->
                <path d="M 150 150 L 150 270 A 120 120 0 0 1 30 150 L 150 150 Z" fill="blue" opacity="0.8"></path>

                <!-- Прямоугольник -->
                <rect x="150" y="30" width="120" height="120" fill="blue" opacity="0.8"></rect>

                <!-- Треугольник -->
                <path d="M 150 150 L 150 90 L 90 150 Z" fill="blue" opacity="0.8"></path>

            </svg>
        <div class="cursorBox" id="cursorCircle"></div>
        </div>
    </div>

    <!-- Таблица результатов -->
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
                    <th scope="col">Время попадания</th>
                </tr>
                </thead>
                <tbody>
                <%
                    int counter = 1;
                    for (int i = 0; i < values.size(); i += 5) {
                %>
                <tr>
                    <td><%= counter++ %></td>
                    <td><%= values.get(i) %></td>
                    <td><%= values.get(i + 1) %></td>
                    <td><%= values.get(i + 2) %></td>
                    <td><%= values.get(i + 3) %></td>
                    <td><%= values.get(i + 4) %></td>
                </tr>
                <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body>
</html>
