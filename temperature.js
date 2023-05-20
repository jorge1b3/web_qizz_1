const apiUrl = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';

const form = document.querySelector('#form');
const responseField = document.querySelector('#table');
const inputField = document.querySelector('#input');

const getData = async () => {
  const departamento = inputField?.value ?? '';
  const url = departamento.length === 0
    ? apiUrl
    : apiUrl.concat('?departamento=', departamento);

  const response = Promise.allSettled([
    fetch(url).then(response => {
      if (!response.ok) throw new Error(response.status); // Lanzamos un error si la respuesta no es ok
      return response.json();
    })])
    .then(([{ value, reason }]) => {
      return { data: value, error: reason }; // Retornamos un objeto con los datos y el error
    });
  renderResponse(await response);
};

const generateTable = event => {
  event.preventDefault();

  // Limpiamos el contenedor de la tabla
  while (responseField.firstChild) {
    responseField.removeChild(responseField.firstChild);
  };

  // Dibujamos un spiner
  const spinnerPos = document.createElement('div');
  spinnerPos.className = 'd-flex justify-content-center';
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border';
  spinnerPos.appendChild(spinner);
  responseField.appendChild(spinnerPos);

  getData();
};

const renderResponse = response => {
  // Limpiamos el contenedor de la tabla
  console.log(response);
  while (responseField.firstChild) {
    responseField.removeChild(responseField.firstChild);
  };

  // Si hay un error lo mostramos en la consola y retornamos
  if (response.error) {
    console.log(response.error);
    return;
  }

  // Creando partes de la tabla
  const table = document.createElement('table');
  const tblHead = document.createElement('thead');
  const firstRow = document.createElement('tr');
  const tblBody = document.createElement('tbody');
  table.className = 'table table-striped table-blue text-center text-wrap';

  // Los campos a buscar y mostrar
  const fields = new Map([
    ['Fecha', 'fechaobservacion'],
    ['Valor', 'valorobservado'],
    ['Estación', 'nombreestacion'],
    ['Departamento', 'departamento'],
    ['Municipio', 'municipio']
  ]);

  // Llenando cabecera
  Array.from(fields.keys()).forEach(key => {
    const cell = document.createElement('th');
    cell.className = 'col';
    cell.textContent = key;
    firstRow.appendChild(cell);
  });

  // Guardamos la cabecera en la tabla
  tblHead.appendChild(firstRow);
  table.appendChild(tblHead);

  // Llendando cuerpo de la tabla
  response.data.slice(0, 10).forEach(currentItem => {
    const row = document.createElement('tr');
    row.className = 'shadow-sm';
    Array.from(fields.values()).forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = currentItem[value];
      row.appendChild(cell);
    });
    tblBody.appendChild(row);
  });

  // Guardamos el body en la tabla
  table.appendChild(tblBody);
  // Agregamos la tabla al DOM
  responseField.appendChild(table);
};

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
form.addEventListener('submit', generateTable);
