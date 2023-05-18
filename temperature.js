const api_url = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';
const responseField = document.querySelector('#table');

const getData = async () => {
    const departamento = document.querySelector("#input").value.toUpperCase();
    const url = departamento.length === 0 ? api_url : `${api_url}?departamento=${departamento}`
    const response = await fetch(url).catch(errorResponse => console.log(errorResponse.message));
    if (!response.ok) {
        throw new Error('!Petición fallida¡');
    }
    renderResponse(await response.json());
}

const generateTable = event =>{
    event.preventDefault();

    // Dibujamos un spiner
    const spinner_pos = document.createElement("div");
    spinner_pos.className = "d-flex justify-content-center"
    const spinner = document.createElement("div");
    spinner.className = "spinner-border";
    spinner_pos.appendChild(spinner)
    responseField.innerHTML = spinner_pos.outerHTML;

    getData();
}

const renderResponse = data => {
    if (data.errors){
        responseField.innerHTML = `<p>No se ha podido generar la tabla</p>`;
        return;
    }

    // Creando partes de la tabla
    const table   = document.createElement("table");
    const tblHead = document.createElement("thead");
    const firstRow = document.createElement("tr");
    const tblBody = document.createElement("tbody");
    table.className= "table table-striped table-blue"

    // Los campos a buscar y mostrar
    const fields = {
        "Fecha" : "fechaobservacion",
        "Valor" : "valorobservado",
        "Estación" : "nombreestacion",
        "Departamento" : "departamento",
        "Municipio" : "municipio"
    }

    // Llenando cabecera
    Object.keys(fields).forEach(label =>{
        const cell = document.createElement("th");
        cell.className = "col text-center"
        cell.innerHTML = `<p>${label}<\p>`
        firstRow.appendChild(cell);
    });
    tblHead.appendChild(firstRow);
    table.appendChild(tblHead);

    // Llendando cuerpo de la tabla
    data.slice(0,10).forEach(currentItem => {
        const row = document.createElement("tr");
        row.className = "text-sm-center text-wrap shadow-sm"
        Object.values(fields).forEach(key =>{
            const cell = document.createElement("td");
            cell.innerHTML = `<p>${currentItem[key]}<\p>`
            row.appendChild(cell);
        });
        tblBody.appendChild(row);
    });
    
    // Guardamos el body en la tabla
    table.appendChild(tblBody);
    // Remplazamos todo el texto HTML dentro del campo responseField con la tabla
    responseField.innerHTML = table.outerHTML
}

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
document.querySelector("#form").addEventListener("submit",generateTable);