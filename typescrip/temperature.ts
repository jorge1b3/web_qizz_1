const apiUrl: string = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';

// querySelector selecciona usando los selectores de css
const responseField = document.querySelector('#table') as HTMLDivElement;
const form = document.querySelector("#form") as HTMLFormElement;
const inputField = document.querySelector("#input") as HTMLInputElement;

const getData = async () => {
    const departamento:string = inputField.value.toUpperCase as unknown as string;
    const url = departamento.length === 0 ? apiUrl : `${apiUrl}?departamento=${departamento}`
    const response : Response = await fetch(url).catch(e => {throw new Error(e)});
    if (!response.ok){
        throw new Error('Failed Request!');
    }
    renderResponse(await response.json());
}

const generateTable = event =>{
    event.preventDefault();

    // Dibujamos un spiner
    const spinner_pos = document.createElement("div") as HTMLDivElement;
    spinner_pos.className = "d-flex justify-content-center";
    const spinner = document.createElement("div") as HTMLDivElement;
    spinner.className = "spinner-border";
    spinner_pos.appendChild(spinner);
    responseField.innerHTML = spinner_pos.outerHTML;

    try{
        getData();
    }catch(e){
        console.log(e);
    }
}

const renderResponse = data => {
    if (data.errors){
        responseField.innerHTML = `<p>No se ha podido generar la tabla</p>`;
        return;
    }

    // Creando partes de la tabla
    const table   = document.createElement("table") as HTMLTableElement;
    const tblHead = document.createElement("thead");
    const firstRow = document.createElement("tr");
    const tblBody = document.createElement("tbody");
    table.className= "table table-striped table-blue";

    // Los campos a buscar y mostrar
    const fields = {
        "Fecha" : "fechaobservacion",
        "Valor" : "valorobservado",
        "Estación" : "nombreestacion",
        "Departamento" : "departamento",
        "Municipio" : "municipio"
    };

    // Llenando cabecera
    Object.keys(fields).forEach(label =>{
        const cell = document.createElement("th");
        cell.className = "col text-center";
        cell.innerHTML = `<p>${label}<\p>`;
        firstRow.appendChild(cell);
    });
    tblHead.appendChild(firstRow);
    table.appendChild(tblHead);

    // Llendando cuerpo de la tabla
    data.slice(0,10).forEach(currentItem => {
        const row = document.createElement("tr");
        row.className = "text-sm-center text-wrap shadow-sm";
        Object.values(fields).forEach(key =>{
            const cell = document.createElement("td");
            cell.innerHTML = `<p>${currentItem[key]}<\p>`;
            row.appendChild(cell);
        });
        tblBody.appendChild(row);
    });
    
    // Guardamos el body en la tabla
    table.appendChild(tblBody);
    // Remplazamos todo el texto HTML dentro del campo responseField con la tabla
    responseField.innerHTML = table.outerHTML;
}

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
form.addEventListener("submit",generateTable);