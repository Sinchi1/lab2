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
    yInput.value = yInput.value.replace(",",".")
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
        return
    }

    if (selectedX.length === 1){
        const query = new URLSearchParams();
        query.append("x", selectedX[0].value.toString())
        query.append("y", yValue.toString())
        query.append("r", rvalue.toString())

        fetch(`http://localhost:8080/lab2-1.0-SNAPSHOT/control?${query.toString()}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    console.log(":^(")
                    event.preventDefault()
                }
            })
    }
    else {
        event.preventDefault()
        const query = new URLSearchParams();
        query.delete("x")
        const x = Array.from(selectedX).map(checkbox => checkbox.value)
        query.append("x", x.toString())
        query.append("y", yValue.toString())
        query.append("r", rvalue.toString())

            fetch(`http://localhost:8080/lab2-1.0-SNAPSHOT/control?${query}`, {
                method: 'GET',
            })
                .then(response => {
                    if (!response.ok) {
                        console.log(":^(")
                    }
                    query.delete("x")
                    query.delete("y")
                    query.delete("r")
                    console.log("query after fetch:" +
                        "" + query.toString())
                })
        // })
    }
    // location.replace("http://localhost:8080/lab2-1.0-SNAPSHOT/control")
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
        console.log("NORM X SHOULD BE" + ((clickX - 150) / 120) * rValue)

        const normalizedX = ((clickX - 150) / 120) * rValue;
        const normalizedY = ((150 - clickY) / 120) * rValue;

        console.log("normalized x and y: " + normalizedX + " " + normalizedY)

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


        const query = new URLSearchParams();

        query.delete("x")
        query.delete("y")
        query.delete("r")

        query.append("x", normalizedX.toFixed(4).toString())
        query.append("y",  normalizedY.toFixed(4).toString())
        query.append("r", rValue.toString())

        fetch(`http://localhost:8080/lab2-1.0-SNAPSHOT/control?${query}`, {
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    console.log(":^(")
                }
                // location.replace("http://localhost:8080/lab2-1.0-SNAPSHOT/control")
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