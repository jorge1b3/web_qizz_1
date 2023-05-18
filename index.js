// const apiId = '4fzu21pdr0p0xars8tx432sza'
// const apiKey = '3znq8gzgg2h7229yo1mlepjmf0dy2vk8q4t1reeq33gov8rewd';
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
    const departamento = document.getElementById("input").value;

    const data = await getData(departamento).catch((error) =>{
        console.log(error);
        throw new Error("No se pudo procesar la solicitud");
    })

    const tabla   = document.createElement("table");
    const tblHead = document.createElement("thead");
    const tblBody = document.createElement("tbody");
    tabla.className= "table table-bordered table-striped table-sm"

    let tbltr = document.createElement("tr");
    for (head in data[0]){
        const textoCelda = document.createTextNode(`${head}`)
        const celda = document.createElement("th");
        celda.className = "col text-center"
        celda.appendChild(textoCelda);
        tbltr.appendChild(celda);
    }
    tblHead.appendChild(tbltr);
    tabla.appendChild(tblHead);

    for (const row of data.slice(0,10)){
        const hilera = document.createElement("tr");
        hilera.className = "text-sm-center text-wrap"
        for (value in row){
            const celda = document.createElement("td");
            const textoCelda = document.createTextNode(`${row[value]}`);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    
    tabla.appendChild(tblBody);
    responseField.innerHTML = tabla.outerHTML;
}

document.getElementById("form").addEventListener("submit",genTable);