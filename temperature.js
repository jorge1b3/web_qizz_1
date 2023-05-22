const apiUrl = 'https://www.datos.gov.co/resource/ccvq-rp9s.json';

const form = document.querySelector('#form');
const responseField = document.querySelector('#table');
const inputField = document.querySelector('#input');
const spinnerField = document.querySelector('#spinner');

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
  // Limpia el contenido del div
  if (responseField.firstChild) responseField.firstChild.replaceWith('');

  // Dibujamos un spiner
  const spinnerPos = document.createElement('div');
  spinnerPos.className = 'd-flex justify-content-center';
  const spinner = spinnerPos.appendChild(document.createElement('div'));
  spinner.className = 'spinner-border text-primary';
  if (!spinnerField.firstChild) spinnerField.appendChild(spinnerPos);
  else spinnerField.firstChild.replaceWith(spinnerPos);

  getData();
};

const renderResponse = response => {
  // Si hay un error lo mostramos en la consola y retornamos
  if (response.error) {
    console.log(response.error);
    return;
  }

  // Creando la estructura de la tabla
  const table = document.createElement('table');
  table.className = 'table table-striped table-blue text-center text-wrap';
  const tblHead = table.appendChild(document.createElement('thead'));
  const tblBody = table.appendChild(document.createElement('tbody'));

  // Los campos a buscar y mostrar
  const fields = new Map([
    ['Fecha', 'fechaobservacion'],
    ['Valor', 'valorobservado'],
    ['Estación', 'nombreestacion'],
    ['Departamento', 'departamento'],
    ['Municipio', 'municipio']
  ]);

  // Crenado la cabecera y añadiendo el campo número de fila
  const firstRow = tblHead.appendChild(document.createElement('tr'));
  const number = firstRow.appendChild(document.createElement('th'));
  number.textContent = '#';

  // Llenando cabecera
  for (const key of fields.keys()) {
    const head = firstRow.appendChild(document.createElement('th'));
    head.textContent = key;
  };

  // Poniendo el atributo scope en col a todos los elementos de la cabecera
  firstRow.childNodes.forEach(node => node.setAttribute('scope', 'col'));

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

  // Removemos el spiner
  spinnerField.firstChild.replaceWith('');
  // Remplazamos el contenido del div por la tabla
  if (!responseField.firstChild) responseField.appendChild(table);
  else responseField.firstChild.replaceWith(table);
};

// Agregamos un evento al botón form para que ejecutr generateTable al hacer click
form.addEventListener('submit', generateTable);
