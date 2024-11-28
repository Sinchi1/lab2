const XInput = document.getElementById('x')
const yInput = document.getElementById('y')
const RInput = document.getElementById('r')
const xButtons = document.getElementsByClassName("x_button");
const sircleBox = document.getElementById("cursorCircle")
const graph = document.getElementById("graph");
const checkboxX = document.querySelectorAll('input[name="x"]');
const send = document.getElementById("confirm");

checkboxX.forEach((checkbox) => {
    checkbox.addEventListener('click', function (){
        if (checkbox.checked){
            checkboxX.forEach((cb) => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            })
        } else {
            checkbox.checked = false;
        }
    })
})

// lab2-1.0-SNAPSHOT/control

for(let i = 0; i < xButtons.length; i++){
    xButtons[i].onclick = function(){
        for(let i = 0; i < xButtons.length; i++){
            xButtons[i].style.border = "1px solid black"
        }
        xButtons[i].style.border = "2px solid green"
        XInput.value = xButtons[i].value
    }
}

graph.addEventListener("mouseenter", () => {
    console.log("залетел")
    sircleBox.style.display = 'block';
});

graph.addEventListener("mouseleave", () =>{
    console.log("вылетел")
    sircleBox.style.display = 'none';
});

graph.addEventListener("mousemove", (event) =>{
    const rect = graph.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    sircleBox.style.left = `${x}px`
    sircleBox.style.top = `${y}px`
});

function dataTransfer() {

    var fields = [yInput, RInput]
    var regexes = [
        /^(?:[-]?[0-2][.,]\d+|[34][.,]\d+|(?:-[1-3]|[0-5])([.,]0+)?)$/,       //  -3 <= y <= 5
        /^(?:[1-3][.,]\d+|[1-4]([,.]0+)?)$/                                 //   1 <= R <= 4
    ]

    for (var i = 0; i < fields.length; i++) {
        if (validate(fields[i], regexes[i]) === true) {
            findLable(fields[i]).innerText = ''
        } else {
            findLable(fields[i]).innerText = 'Введено неверное значение'
            flag = false
        }
    }

    if(flag === false){
        event.preventDefault()
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const checkboxesContainer = document.getElementById("x");
    const yInput = document.getElementById("y");
    const rSelect = document.getElementById("r");

    const checkboxes = () => document.querySelectorAll("#x input[type='checkbox']");
    const xValues = () => Array.from(checkboxes()).map(checkbox => parseFloat(checkbox.value));

    // При клике на график
    graph.addEventListener("click", event => {
        const rect = graph.getBoundingClientRect();
        const clickX = event.clientX - rect.left; // Координата X внутри SVG
        const clickY = event.clientY - rect.top;  // Координата Y внутри SVG

        const rValue = parseFloat(rSelect.value); // Текущее значение R
        if (isNaN(rValue)) {
            alert("Сначала выберите значение R!");
            return;
        }

        // Нормализация координат (центр графика - 150,150, масштаб - 300x300)
        const normalizedX = ((clickX - 150) / 120) * rValue;
        const normalizedY = ((150 - clickY) / 120) * rValue;

        // Установить Y
        yInput.value = normalizedY.toFixed(2);

        // Проверить, есть ли нормализованное значение X в списке
        const roundedX = normalizedX.toFixed(2); // Округленное значение X
        const xValueExists = xValues().includes(parseFloat(roundedX));

        // Если X отсутствует, добавить временный чекбокс
        if (!xValueExists) {
            // Удаляем старый временный чекбокс (если он есть)
            const tempCheckbox = document.getElementById("temp-x");
            if (tempCheckbox) tempCheckbox.remove();

            // Создаем новый временный чекбокс
            const newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            newCheckbox.id = "temp-x";
            newCheckbox.name = "x"; // Должен соответствовать имени остальных чекбоксов
            newCheckbox.value = roundedX;
            newCheckbox.checked = true; // Отмечаем его

            // Добавляем его в DOM (можно добавить скрытым)
            newCheckbox.style.display = "none";
            checkboxesContainer.appendChild(newCheckbox);
        } else {
            // Если X уже существует, отмечаем его
            checkboxes().forEach(checkbox => {
                checkbox.checked = parseFloat(checkbox.value) === parseFloat(roundedX);
            });
        }
        send.click();
    });
});



function dataTransfer() {
    flag = !(XInput.value === "")
    if (flag === false) {
        document.getElementById('x_error').innerText = 'Выберите значение для x'
    } else {
        if(XInput.value <= 2 && XInput.value >= -2){
            document.getElementById('x_error').innerText = ''
        } else {
            document.getElementById('x_error').innerText = 'Введено неверное значение'
            flag = false
        }
    }

    var fields = [yInput, RInput]
    var regexes = [
        /^(?:[-]?[0-2][.,]\d+|[-][34][.,]\d+|(?:-[1-5]|[0-3])([.,]0+)?)$/,       //  -5 <= y <= 3
        /^(?:[1-4][.,]\d+|[1-5]([,.]0+)?)$/                                 //   1 <= R <= 5
    ]

    for (var i = 0; i < fields.length; i++) {
        if (validate(fields[i], regexes[i]) === true) {
            findLable(fields[i]).innerText = ''
        } else {
            findLable(fields[i]).innerText = 'Введено неверное значение'
            flag = false
        }
    }

    if(flag === false){
        event.preventDefault()
    }
}

function validate(node, regex) {
    return regex.test(node.value)
}



function findLable(node) {
    var nodeId = node.id;
    labels = document.getElementsByTagName('label');
    for (var i = 0; i < labels.length; i++) {
        if (labels[i].htmlFor == nodeId)
            return labels[i];
    }
}

graph.addEventListener('click', ({clientX, clientY}) => {
    let point = graph.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    point = point.matrixTransform(graph.getScreenCTM().inverse());
    const rValue = parseFloat(RInput.value); // Получаем значение R

    if (!validate(RInput, /^(?:[1-5][.,]\d+|[1-4]([,.]0+)?)$/)) {
        findLable(RInput).innerText = 'Введено неверное значение';
        return;
    }

    // Рассчёт X и Y относительно клика
    const normalizedX = ((point.x - 150) / 120) * rValue; // X с учётом R
    const normalizedY = ((150 - point.y) / 120) * rValue; // Y с учётом R

    // Устанавливаем значения в поля ввода
    XInput.value = normalizedX.toFixed(2);
    yInput.value = normalizedY.toFixed(2);

    // Автоматически выполняем отправку данных
    dataTransfer();
});


function addDot(x, y, r){
    var dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    if(x >= 0){
        dot.setAttribute('cx', x * 120 / r + 150)
    } else {
        dot.setAttribute('cx', 120 * (1.25 + x / r))
    }
    if(y >= 0){
        dot.setAttribute('cy', (y / r - 1.25) * -120)
    } else {
        dot.setAttribute('cy', -120 * y / r + 150)
    }
    dot.setAttribute('r', '2')
    dot.setAttribute('fill', '#fc00c6')
    dot.setAttribute("class", "tmpDot")
    graph.appendChild(dot)
}

graph.addEventListener(type="")