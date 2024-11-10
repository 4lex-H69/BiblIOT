// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFVPU03vSep5TvqM4CKItvRnk6RD_JiMM",
  authDomain: "base-de-datos-bibliot.firebaseapp.com",
  projectId: "base-de-datos-bibliot",
  storageBucket: "base-de-datos-bibliot.firebasestorage.app",
  messagingSenderId: "219132203224",
  appId: "1:219132203224:web:2be4522d770c492d4607ad",
  measurementId: "G-2HNSJ3JXEE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Función para agregar un nuevo ítem a la base de datos
async function agregarStock(nombre, autor, codigo, ubicacion) {
  try {
    await addDoc(collection(db, "stock"), {
      nombre: nombre,
      autor: autor,
      codigo: codigo,
      ubicacion: ubicacion
    });
    alert('Stock agregado exitosamente');
  } catch (e) {
    console.error("Error al agregar el documento: ", e);
  }
}

// Función para obtener y mostrar los ítems del stock
async function obtenerStock() {
  const querySnapshot = await getDocs(collection(db, "stock"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    // Aquí puedes agregar código para mostrar los datos en la página
  });
}

// Función para eliminar un ítem por ID
async function eliminarStock(id) {
  try {
    await deleteDoc(doc(db, "stock", id));
    alert('Stock eliminado exitosamente');
  } catch (e) {
    console.error("Error al eliminar el documento: ", e);
  }
}
document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stockForm');
    const stockTable = document.getElementById('stockTable').querySelector('tbody');
    const buscador = document.getElementById('buscador');
    const bloqueoToggle = document.getElementById('bloqueoToggle');
    const eliminarSeleccionados = document.getElementById('eliminarSeleccionados');
    let isEditable = false;

    // Cargar datos del almacenamiento local al cargar la página
    function cargarDatos() {
        const stockData = JSON.parse(localStorage.getItem('stockData')) || [];
        stockData.forEach(item => {
            const row = stockTable.insertRow();
            row.innerHTML = `
                <td><input type="checkbox" class="selectRow"></td>
                <td>${item.titulo}</td>
                <td>${item.autor}</td>
                <td>${item.codigo}</td>
                <td>${item.ubicacion}</td>
            `;
        });
    }

    // Guardar datos en el almacenamiento local
    function guardarDatos() {
        const data = [];
        Array.from(stockTable.rows).forEach(row => {
            const cells = row.cells;
            data.push({
                titulo: cells[1].textContent,
                autor: cells[2].textContent,
                codigo: cells[3].textContent,
                ubicacion: cells[4].textContent
            });
        });
        localStorage.setItem('stockData', JSON.stringify(data));
    }

    // Inicializar datos
    cargarDatos();

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isEditable) {
            alert('La edición está bloqueada. Introduzca la contraseña para desbloquear.');
            return;
        }

        const titulo = document.getElementById('nombre').value;
        const autor = document.getElementById('autor').value;
        const codigo = document.getElementById('codigo').value;
        const ubicacion = document.getElementById('ubicacion').value;

        const row = stockTable.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="selectRow"></td>
            <td>${titulo}</td>
            <td>${autor}</td>
            <td>${codigo}</td>
            <td>${ubicacion}</td>
        `;

        guardarDatos(); // Guardar en el almacenamiento local
        stockForm.reset();
    });

    buscador.addEventListener('input', () => {
        const filter = buscador.value.toLowerCase();
        Array.from(stockTable.rows).forEach(row => {
            const cells = Array.from(row.cells);
            const match = cells.some(cell => cell.textContent.toLowerCase().includes(filter));
            row.style.display = match ? '' : 'none';
        });
    });

    bloqueoToggle.addEventListener('click', () => {
        if (isEditable) {
            isEditable = false;
            bloqueoToggle.textContent = 'Activar Edición';
        } else {
            const password = prompt('Ingrese la contraseña para activar la edición:');
            if (password === 'Alex') {
                isEditable = true;
                bloqueoToggle.textContent = 'Desactivar Edición';
                alert('Edición activada.');
            } else {
                alert('Contraseña incorrecta.');
            }
        }
    });

    eliminarSeleccionados.addEventListener('click', () => {
        if (!isEditable) {
            alert('La edición está bloqueada. Introduzca la contraseña para desbloquear.');
            return;
        }

        const seleccionados = document.querySelectorAll('.selectRow:checked');
        seleccionados.forEach(checkbox => {
            const row = checkbox.closest('tr');
            row.remove();
        });

        guardarDatos(); // Actualizar el almacenamiento local
    });
});
