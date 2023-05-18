// const apiId = '4fzu21pdr0p0xars8tx432sza'
// const apiKey = '3znq8gzgg2h7229yo1mlepjmf0dy2vk8q4t1reeq33gov8rewd';
const api_url = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';

const responseField = document.querySelector('#table');

async function getData(departamento){
    url = `${api_url}?departamento=${departamento}`
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error('Request failed');
    }
    const jsonData = await response.json();
    return jsonData;
}

async function genTable(event) {
    event.preventDefault();
    var departamento = document.getElementById("input").value;

    const data = await getData(departamento).catch((error) =>{
        console.log(error);
        throw new Error("No se pudo procesar la solicitud");
    })

    var tabla   = document.createElement("table");
    var tblHead = document.createElement("thead");
    var tblBody = document.createElement("tbody");
    tabla.className= "table table-bordered table-striped table-sm"

    var tbltr = document.createElement("tr");
    for (head in data[0]){
        var textoCelda = document.createTextNode(`${head}`)
        var celda = document.createElement("th");
        celda.className = "col text-center"
        celda.appendChild(textoCelda);
        tbltr.appendChild(celda);
    }
    tblHead.appendChild(tbltr);
    tabla.appendChild(tblHead);

    for (const row of data.slice(0,10)){
        var hilera = document.createElement("tr");
        hilera.className = "text-sm-center text-wrap"
        for (value in row){
            var celda = document.createElement("td");
            var textoCelda = document.createTextNode(`${row[value]}`);
            celda.appendChild(textoCelda);
            hilera.appendChild(celda);
        }
        tblBody.appendChild(hilera);
    }
    
    tabla.appendChild(tblBody);
    responseField.innerHTML = tabla.outerHTML;
}

document.getElementById("form").addEventListener("submit",genTable);