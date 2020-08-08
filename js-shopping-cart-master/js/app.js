// Variables
const carrito = document.getElementById('carrito');
const cursos = document.getElementById('lista-cursos');
const listaCursos = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');


// Listeners
cargarEventListeners();
function cargarEventListeners() {
  // Triggers when "Add Cart" is pressed
  cursos.addEventListener('click', comprarCurso);
  // When a course is removed from the cart
  carrito.addEventListener('click', eliminarCurso);
  // When emptying the cart
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  // When uploading document, show LocalStorage
  document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

// Features
// 
//Function that adds the course to the cart
function comprarCurso(e) {
  e.preventDefault();
  // Delegation to add-cart
  if(e.target.classList.contains('agregar-carrito')) {
    const curso = e.target.parentElement.parentElement;
    // We send the selected course to collect your data
    leerDatosCurso(curso);
  }
}

// Read the course data
function leerDatosCurso(curso) {
  const infoCurso = {
    imagen: curso.querySelector('img').src,
    titulo: curso.querySelector('h4').textContent,
    precio: curso.querySelector('.discount').textContent,
    id: curso.querySelector('a').getAttribute('data-id')
  }
  insertarCarrito(infoCurso);
}

// Show the selected course in the Cart
function insertarCarrito(curso) {
  const row = document.createElement('tr');
  row.innerHTML = `
  <td>
  <img src="${curso.imagen}" width=100>
  </td>
  <td>${curso.titulo}</td>
  <td>${curso.precio}</td>
  <td>
  <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
  </td>
  `;
  listaCursos.appendChild(row);
  guardarCursoLocalStorage(curso);
}

// Delete the course from the cart in the DOM
function eliminarCurso(e) {
  e.preventDefault();
  let curso,
      cursoId;
  if(e.target.classList.contains('borrar-curso') ) {
    e.target.parentElement.parentElement.remove();
    curso = e.target.parentElement.parentElement;
    cursoId = curso.querySelector('a').getAttribute('data-id');
  }
  eliminarCursoLocalStorage(cursoId);
}

// Remove courses from the cart in the DOM
function vaciarCarrito() {
  // slow way
  // listaCursos.innerHTML = '';
  // fast way (recommended)
  while(listaCursos.firstChild) {
    listaCursos.removeChild(listaCursos.firstChild);
  }

  // Vaciar Local Storage
  vaciarLocalStorage();
  return false;
}

// Store courses in cart to Local Storage
function guardarCursoLocalStorage(curso) {
  let cursos;
  // It takes the value of an array with LS data or empty
  cursos = obtenerCursosLocalStorage();
  // the selected course is added to the arrangement
  cursos.push(curso);
  localStorage.setItem('cursos', JSON.stringify(cursos) );
}

// Check for items in Local Storage
function obtenerCursosLocalStorage() {
  let cursosLS;
  // we check if there is something in localStorage
  if(localStorage.getItem('cursos') === null) {
    cursosLS = [];
  } else {
    cursosLS = JSON.parse( localStorage.getItem('cursos') );
  }
  return cursosLS;
}

// Print the Local Storage courses in the cart
function leerLocalStorage() {
  let cursosLS;
  cursosLS = obtenerCursosLocalStorage();
  cursosLS.forEach(function(curso){
  // build the template
  const row = document.createElement('tr');
  row.innerHTML = `
  <td>
  <img src="${curso.imagen}" width=100>
  </td>
  <td>${curso.titulo}</td>
  <td>${curso.precio}</td>
  <td>
  <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
  </td>
  `;
  listaCursos.appendChild(row);
  });
}

// Delete the course by the ID in Local Storage
function eliminarCursoLocalStorage(curso) {
  let cursosLS;
  // We obtain the arrangement of courses
  cursosLS = obtenerCursosLocalStorage();
  // We iterate by comparing the deleted course ID with those of the LS
  cursosLS.forEach(function(cursoLS, index) {
    if(cursoLS.id === curso) {
      cursosLS.splice(index, 1);
    }
  });
  // We add the current arrangement to storage
  localStorage.setItem('cursos', JSON.stringify(cursosLS) );
}

// Remove all courses from Local Storage
function vaciarLocalStorage() {
  localStorage.clear();
}
