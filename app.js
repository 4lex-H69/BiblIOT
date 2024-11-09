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
                <td>${item.nombre}</td>
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
                nombre: cells[1].textContent,
                codigo: cells[2].textContent,
                ubicacion: cells[3].textContent
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

        const nombre = document.getElementById('nombre').value;
        const codigo = document.getElementById('codigo').value;
        const ubicacion = document.getElementById('ubicacion').value;

        const row = stockTable.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="selectRow"></td>
            <td>${nombre}</td>
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
