const api_url = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';
const responseField = document.querySelector('#table');

async function getData(departamento){
    const url = departamento.length === 0 ? api_url : `${api_url}?departamento=${departamento}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('!Petición fallida¡');
    }
    const jsonData = await response.json();
    return jsonData;
}

async function generateTable(event) {
    // Evitamos el comportamiento predeterminado del botón
    event.preventDefault();

    // Obtenemos el valor en el campo
    const departamento = document.querySelector("#input").value.toUpperCase();

    // Hacemos una animación (un spiner) mientras se obtienen los datos
    const spinner_pos = document.createElement("div");
    spinner_pos.className = "d-flex justify-content-center"
    const spinner = document.createElement("div");
    spinner.className = "spinner-border";
    spinner_pos.appendChild(spinner)
    responseField.innerHTML = spinner_pos.outerHTML;

    // Obtenemos los datos mediante funciones asíncronas
    const data = await getData(departamento).catch((error) =>{
        console.log(error);
        throw new Error("No se pudo procesar la solicitud");
    })

    // Creando partes de la tabla
    const table   = document.createElement("table");
    const tblHead = document.createElement("thead");
    const firstRow = document.createElement("tr");
    const tblBody = document.createElement("tbody");
    table.className= "table table-striped table-dark"
    tblHead.className = "shadow-lg"

    // Los campos a buscar y mostrar
    const fields = {
        "Fecha" : "fechaobservacion",
        "Valor" : "valorobservado",
        "Estación" : "nombreestacion",
        "Departamento" : "departamento",
        "Municipio" : "municipio"
    }

    // Llenando cabecera
    for (const field in fields){
        const cellText = document.createTextNode(`${field}`)
        const cell = document.createElement("th");
        cell.className = "col text-center"
        cell.appendChild(cellText);
        firstRow.appendChild(cell);
    }
    tblHead.appendChild(firstRow);
    table.appendChild(tblHead);

    // Llenando cuerpo d la tabla (solo hasta 10 valores)
    for (const dataRow of data.slice(0,10)){
        const row = document.createElement("tr");
        row.className = "text-sm-center text-wrap shadow-sm"
        for (const field in fields){
            const cell = document.createElement("td");
            const cellText = document.createTextNode(`${dataRow[fields[field]]}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    
    table.appendChild(tblBody);
    responseField.innerHTML = table.outerHTML
}

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
document.querySelector("#form").addEventListener("submit",generateTable);