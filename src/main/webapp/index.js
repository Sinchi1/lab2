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

document.getElementById('form').addEventListener('submit', function (event) {
    let isValid = true;

    const xError = document.getElementById('x_error');
    const yError = document.getElementById('y_error');
    const rError = document.getElementById("r_error");


    xError.textContent = '';
    yError.textContent = '';
    rError.textContent = '';

    // Проверка x
    const selectedX = Array.from(document.querySelectorAll('input[name="x"]:checked'));
    if (selectedX.length === 0) {
        xError.textContent = 'Выберите хотя бы одно значение X.';
        isValid = false;
    }

    // Проверка y
    const yInput = document.getElementById('y');
    const yValue = parseFloat(yInput.value);
    if (isNaN(yValue) || yValue < -5 || yValue > 3) {
        yError.textContent = 'Введите значение Y';
        isValid = false;
    }

    const rvalue = parseFloat(document.getElementById("r").value);
    if (isNaN(rvalue)){
        rError.textContent = 'Выберите значение R'
        isValid = false
    }

    if (!isValid) {
        event.preventDefault();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const checkboxesContainer = document.getElementById("x");
    const yInput = document.getElementById("y");
    const rSelect = document.getElementById("r");

    const checkboxes = () => document.querySelectorAll("#x input[type='checkbox']");
    const xValues = () => Array.from(checkboxes()).map(checkbox => parseFloat(checkbox.value));

    // При клике на график
    graph.addEventListener("click", event => {
        const rect = graph.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        const rError = document.getElementById("r_error")

        rError.textContent = "";

        const rValue = parseFloat(rSelect.value);

        if (!isNaN(rValue)) {
            rError.textContent = "Укажите значение R"
            event.preventDefault()
        }

        // (центр графика - 150,150, масштаб - 300x300)
        const normalizedX = ((clickX - 150) / 120) * rValue;
        const normalizedY = ((150 - clickY) / 120) * rValue;


        yInput.value = normalizedY.toFixed(2);


        const roundedX = normalizedX.toFixed(2); // Округленное значение X
        const xValueExists = xValues().includes(parseFloat(roundedX));


        if (!xValueExists) {

            const tempCheckbox = document.getElementById("temp-x");
            if (tempCheckbox) tempCheckbox.remove();


            const newCheckbox = document.createElement("input");
            newCheckbox.type = "checkbox";
            newCheckbox.id = "temp-x";
            newCheckbox.name = "x";
            newCheckbox.value = roundedX;
            newCheckbox.checked = true;

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


graph.addEventListener('click', ({clientX, clientY}) => {
    let point = graph.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    point = point.matrixTransform(graph.getScreenCTM().inverse());
    const rValue = parseFloat(RInput.value); // Получаем значение R

    // Рассчёт X и Y относительно клика
    const normalizedX = ((point.x - 150) / 120) * rValue; // X с учётом R
    const normalizedY = ((150 - point.y) / 120) * rValue; // Y с учётом R

    // Устанавливаем значения в поля ввода
    XInput.value = normalizedX.toFixed(2);
    yInput.value = normalizedY.toFixed(2);


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