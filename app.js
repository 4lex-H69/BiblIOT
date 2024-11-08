document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginMessage = document.getElementById('loginMessage');
    const stockSection = document.getElementById('stockSection');
    const loginSection = document.getElementById('loginSection');
    const bloqueoToggle = document.getElementById('bloqueoToggle');
    let isEditable = false;

    loginButton.addEventListener('click', () => {
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (username === 'WebIOT' && password === 'KeyIPETyM') {
            loginMessage.textContent = 'Inicio de sesión exitoso.';
            loginMessage.style.color = 'green';
            loginSection.style.display = 'none';
            stockSection.style.display = 'block';
            isEditable = true; // Permite la edición
        } else {
            loginMessage.textContent = 'Nombre de usuario o contraseña incorrectos.';
            loginMessage.style.color = 'red';
        }
    });

    // Lógica de bloqueo de edición
    bloqueoToggle.addEventListener('click', () => {
        if (!isEditable) {
            alert('La edición está bloqueada. Inicie sesión para desbloquearla.');
        } else {
            isEditable = !isEditable;
            bloqueoToggle.textContent = isEditable ? 'Desactivar Edición' : 'Activar Edición';
        }
    });

    // Funciones del formulario de stock y buscador (siguen igual que en el ejemplo anterior)
    const stockForm = document.getElementById('stockForm');
    const stockTable = document.getElementById('stockTable').querySelector('tbody');
    const buscador = document.getElementById('buscador');

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!isEditable) {
            alert('Edición bloqueada. Inicie sesión para agregar elementos.');
            return;
        }

        const nombre = document.getElementById('nombre').value;
        const codigo = document.getElementById('codigo').value;
        const ubicacion = document.getElementById('ubicacion').value;

        const row = stockTable.insertRow();
        row.innerHTML = `<td>${nombre}</td><td>${codigo}</td><td>${ubicacion}</td>`;

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
});