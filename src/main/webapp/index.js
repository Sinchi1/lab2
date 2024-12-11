const XInput = document.getElementById('x')
const yInput = document.getElementById('y')
const RInput = document.getElementById('r')
const xButtons = document.getElementsByClassName("x_button");
const sircleBox = document.getElementById("cursorCircle")
const graph = document.getElementById("graph");
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

    sircleBox.style.display = 'block';
});

graph.addEventListener("mouseleave", () =>{

    sircleBox.style.display = 'none';
});

graph.addEventListener("mousemove", (event) =>{
    const rect = graph.getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    sircleBox.style.left = `${x}px`
    sircleBox.style.top = `${y}px`
});

document.getElementById('form').addEventListener('submit', async function (event) {
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
    }else {
        const xcheck = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];

        const outOfRange = selectedX.some(input => {
            const value = parseFloat(input.value); // Преобразуем значение в число
            console.log(value);
            console.log(xcheck);
            console.log(!xcheck.includes(value)); // Проверяем наличие значения в массиве
            return !xcheck.includes(value); // Если значения нет в массиве, возвращаем true
        });

        if (outOfRange) {
            xError.textContent = 'Значения X должны лежать в пределах от -2 до 2';
            isValid = false;
        } else {
            xError.textContent = ''; // Очищаем сообщение об ошибке, если всё верно
        }
    }

    // Проверка y
    const yInput = document.getElementById('y');
    yInput.value = yInput.value.replace(",", ".")
    const yValue = parseFloat(yInput.value);
    if (isNaN(yValue)) {
        yError.textContent = 'Введите значение Y';
        isValid = false;
    }
    if (yValue < -5 || yValue > 3){
        yError.textContent = 'Введите значение Y';
        isValid = false;
    }

    const rvalue = parseFloat(document.getElementById("r").value);
    if (isNaN(rvalue)) {
        rError.textContent = 'Выберите значение R'
        isValid = false
    }
    if (!(rvalue >= 1 && rvalue <= 5)){
        rError.textContent = "Значение R лежит от 1 до 5"
        isValid = false

    }

    if (!isValid) {
        event.preventDefault();
        return
    }

        event.preventDefault()
        const query = new URLSearchParams();
        query.delete("x")
        query.delete("y")
        query.delete("r")
        const x = Array.from(selectedX).map(checkbox => checkbox.value)
        query.append("x", x.toString())
        query.append("y", yInput.value.toString())
        console.log(yInput.value.toString())
        query.append("r", rvalue.toString())

        await fetch(`http://localhost:8080/lab2-1.0-SNAPSHOT/control?${query}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    console.log(":^(")
                }
                else{location.replace("http://localhost:8080/lab2-1.0-SNAPSHOT/control")}
            })
        // })
    // }

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

        console.log("clicks: " +clickX + " " +  clickY)

        const rError = document.getElementById("r_error")

        rError.textContent = "";

        const rValue = parseFloat(rSelect.value);

        console.log("rvalue " + rValue)

        if (isNaN(rValue)) {
            rError.textContent = "Укажите значение R"
            event.preventDefault()
            return
        }

        // (центр графика - 150,150, масштаб - 300x300)

        const normalizedX = ((clickX - 150) / 120) * rValue;
        const normalizedY = ((150 - clickY) / 120) * rValue;

        console.log("normalized x and y: " + normalizedX + " " + normalizedY)

        yInput.value = normalizedY.toFixed(2);

        const roundedX = normalizedX.toFixed(2);
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


            newCheckbox.style.display = "none";
            checkboxesContainer.appendChild(newCheckbox);
        } else {
            checkboxes().forEach(checkbox => {
                checkbox.checked = parseFloat(checkbox.value) === parseFloat(roundedX);
            });
        }


        const query = new URLSearchParams();

        query.delete("x")
        query.delete("y")
        query.delete("r")

        query.append("x", normalizedX.toFixed(4).toString())
        query.append("y",  yInput.value.toString())
        query.append("r", rValue.toString())

        fetch(`http://localhost:8080/lab2-1.0-SNAPSHOT/control?${query}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    console.log(":^(")
                }
                location.replace("http://localhost:8080/lab2-1.0-SNAPSHOT/control")
            })


    });
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