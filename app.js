// Función para cargar automáticamente un archivo Excel del repositorio de GitHub
function loadExcelFile() {
    fetch('datos_stock.xlsx') // Ruta del archivo en el repositorio
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo Excel');
            }
            return response.arrayBuffer();
        })
        .then(data => {
            // Leer el archivo con la librería XLSX
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Usar la primera hoja
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log(jsonData); // Verificar que los datos se cargaron correctamente
            displayDataInTable(jsonData); // Llamada para mostrar los datos en la tabla
        })
        .catch(error => {
            console.error('Error al cargar el archivo Excel:', error);
            alert('No se pudo cargar el archivo Excel.');
        });
}

// Función para mostrar los datos del archivo Excel en la tabla
function displayDataInTable(data) {
    const tableBody = document.querySelector('#stockTable tbody');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de mostrar nuevos datos

    data.forEach((row, index) => {
        const tr = document.createElement('tr');

        // Crear celdas para cada columna
        const cellTitulo = document.createElement('td');
        cellTitulo.textContent = row.Titulo || '';
        tr.appendChild(cellTitulo);

        const cellAutor = document.createElement('td');
        cellAutor.textContent = row.Autor || '';
        tr.appendChild(cellAutor);

        const cellCodigo = document.createElement('td');
        cellCodigo.textContent = row.Codigo || '';
        tr.appendChild(cellCodigo);

        const cellUbicacion = document.createElement('td');
        cellUbicacion.textContent = row.Ubicacion || '';
        tr.appendChild(cellUbicacion);

        tableBody.appendChild(tr);
    });
}

// Llama a la función al cargar la página
window.onload = loadExcelFile;
