document.getElementById('verExcel').addEventListener('click', () => {
  // URL del archivo Excel en tu repositorio de GitHub
  const url = 'https://raw.githubusercontent.com/tu-usuario/tu-repositorio/rama/stock.xlsx';

  fetch(url)
    .then(response => response.arrayBuffer())
    .then(data => {
      const libro = XLSX.read(data, { type: 'array' });
      const hoja = libro.Sheets[libro.SheetNames[0]];
      const contenido = XLSX.utils.sheet_to_html(hoja);
      document.getElementById('contenidoExcel').innerHTML = contenido;
    })
    .catch(error => {
      console.error('Error al cargar el archivo Excel:', error);
      alert('No se pudo cargar el archivo Excel');
    });
});
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
