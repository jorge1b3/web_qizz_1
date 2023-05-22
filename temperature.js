const apiUrl = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';

const form = document.querySelector('#form');
const responseField = document.querySelector('#table');
const inputField = document.querySelector('#input');

const config = {
  metod: 'GET',
  mode: 'cors'
};

const getData = async () => {
  const departamento = inputField?.value ?? '';
  const url = ((departamento.length === 0))
    ? apiUrl
    : apiUrl.concat('?departamento=', departamento);

  const response = Promise.allSettled([
    fetch(url, config).then(response => {
      // Lanzamos un error si la respuesta no es ok
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })])
    .then(([{ value, reason }]) => {
      // Retornamos un objeto con los datos y el error
      return { data: value, error: reason };
    });
  renderResponse(await response);
};

const generateTable = event => {
  event.preventDefault();

  // Dibujamos un spiner
  const spinnerPos = document.createElement('div');
  spinnerPos.className = 'd-flex justify-content-center';
  const spinner = spinnerPos.appendChild(document.createElement('div'));
  spinner.className = 'spinner-border text-primary';
  if (!responseField.firstChild) responseField.appendChild(spinnerPos);
  responseField.firstChild.replaceWith(spinnerPos);

  getData();
};

const renderResponse = response => {
  // Si hay un error lo mostramos en la consola y retornamos
  if (response.error) {
    console.log(response.error);
    return;
  }

  // Creando partes de la tabla
  const table = document.createElement('table');
  table.className = 'table table-striped table-blue text-center text-wrap';
  const tblHead = document.createElement('thead');
  const firstRow = document.createElement('tr');
  const tblBody = document.createElement('tbody');
  // Los campos a buscar y mostrar
  const fields = new Map([
    ['Fecha', 'fechaobservacion'],
    ['Valor', 'valorobservado'],
    ['Estación', 'nombreestacion'],
    ['Departamento', 'departamento'],
    ['Municipio', 'municipio']
  ]);

  // Creando un número para la cabecera
  const number = firstRow.appendChild(document.createElement('th'));
  number.textContent = '#';
  number.setAttribute('scope', 'col');
  // Llenando cabecera
  for (const key of fields.keys()) {
    const head = firstRow.appendChild(document.createElement('th'));
    head.textContent = key;
    head.setAttribute('scope', 'col');
  };

  // Guardamos la cabecera en la tabla
  tblHead.appendChild(firstRow);
  table.appendChild(tblHead);

  // Llendando cuerpo de la tabla
  response.data.slice(0, 10).forEach((item, index) => {
    const row = document.createElement('tr');

    // Creando un número para la fila
    const number = row.appendChild(document.createElement('th'));
    number.setAttribute('scope', 'row');
    number.textContent = index + 1;

    // Llenando la fila
    for (const value of fields.values()) {
      const cell = row.appendChild(document.createElement('td'));
      cell.textContent = item[value];
    };
    tblBody.appendChild(row);
  });

  // Guardamos el body en la tabla
  table.appendChild(tblBody);
  // Remplazamos el spiner por la tabla
  responseField.firstChild.replaceWith(table);
};

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
form.addEventListener('submit', generateTable);
