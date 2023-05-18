const api_url = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';
const responseField = document.querySelector('#table');

async function getData(departamento){
    const url = `${api_url}?departamento=${departamento}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('!Petición fallida¡');
    }
    const jsonData = await response.json();
    return jsonData;
}

async function genTable(event) {
    event.preventDefault();
    const departamento = document.getElementById("input").value.toUpperCase();

    const spinner = document.createElement("div");
    spinner.className = "spinner-border align-content-lg-center";
    responseField.innerHTML = spinner.outerHTML;

    const data = await getData(departamento).catch((error) =>{
        console.log(error);
        throw new Error("No se pudo procesar la solicitud");
    })
    const table   = document.createElement("table");
    const tblHead = document.createElement("thead");
    const firstRow = document.createElement("tr");
    const tblBody = document.createElement("tbody");
    table.className= "table table-striped table-dark"

    const fields = {
        "Fecha" : "fechaobservacion",
        "Valor" : "valorobservado",
        "Estación" : "nombreestacion",
        "Departamento" : "departamento",
        "Municipio" : "municipio"
    }

    for (const field in fields){
        const cellText = document.createTextNode(`${field}`)
        const cell = document.createElement("th");
        cell.className = "col text-center"
        cell.appendChild(cellText);
        firstRow.appendChild(cell);
    }
    tblHead.appendChild(firstRow);
    table.appendChild(tblHead);

    for (const dataRow of data.slice(0,10)){
        const row = document.createElement("tr");
        row.className = "text-sm-center text-wrap"
        for (const field in fields){
            const cell = document.createElement("td");
            const cellText = document.createTextNode(`${dataRow[fields[field]]}`);
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    
    table.appendChild(tblBody);
    setTimeout(() => responseField.innerHTML = table.outerHTML, 500);
}

document.getElementById("form").addEventListener("submit",genTable);