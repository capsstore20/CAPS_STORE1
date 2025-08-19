document.addEventListener('DOMContentLoaded', function () {
    // MODALES Y BOTONES
    const showAuthModalBtn = document.getElementById('show-auth-modal');
    const authModal = document.getElementById('auth-modal');
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    const showAdminLoginBtn = document.getElementById('show-admin-login-modal');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLoginBtn = document.getElementById('close-admin-login-modal');

    // Mostrar modal usuario
    showAuthModalBtn?.addEventListener('click', () => authModal.style.display = 'block');
    closeAuthModalBtn?.addEventListener('click', () => authModal.style.display = 'none');

    // Mostrar modal admin
    showAdminLoginBtn?.addEventListener('click', () => adminLoginModal.style.display = 'block');
    closeAdminLoginBtn?.addEventListener('click', () => adminLoginModal.style.display = 'none');

    // CAMBIO ENTRE LOGIN Y REGISTRO
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showRegister?.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLogin?.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // LOGIN USUARIO
    const btnIngresar = document.getElementById('btn-ingresar');
    btnIngresar?.addEventListener('click', () => {
        const usuario = document.getElementById('login-usuario').value.trim();
        const contrasena = document.getElementById('login-contrasena').value.trim();

        if (!usuario || !contrasena) {
            alert("Completa todos los campos.");
            return;
        }

        // Simulación: usuarios guardados en localStorage
        let usuarios = JSON.parse(localStorage.getItem('usuariosSimulados') || '[]');
        const user = usuarios.find(u => (u.usuario === usuario || u.correo === usuario) && u.contrasena === contrasena);

        if (user) {
            localStorage.setItem('usuarioLogueado', user.usuario);
            localStorage.setItem('correo', user.correo);
            localStorage.setItem('rolUsuario', 'usuario');
            authModal.style.display = 'none';
            showToast(`¡Bienvenid@, ${user.usuario}!`);
            mostrarPerfilFlotante();
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });

    // REGISTRO DE USUARIO (usa tu registro.php)
    const btnCrearCuenta = document.getElementById('btn-crear-cuenta');
    btnCrearCuenta?.addEventListener('click', () => {
        const usuario = document.getElementById('nuevo-usuario').value.trim();
        const correo = document.getElementById('nuevo-correo').value.trim();
        const contrasena = document.getElementById('nuevo-contrasena').value.trim();

        if (!usuario || !correo || !contrasena) {
            alert("Completa todos los campos para registrarte.");
            return;
        }

        // Simulación: usuarios guardados en localStorage
        let usuarios = JSON.parse(localStorage.getItem('usuariosSimulados') || '[]');
        if (usuarios.find(u => u.usuario === usuario || u.correo === correo)) {
            alert('El usuario o correo ya existe.');
            return;
        }
        usuarios.push({ usuario, correo, contrasena });
        localStorage.setItem('usuariosSimulados', JSON.stringify(usuarios));

        localStorage.setItem('usuarioLogueado', usuario);
        localStorage.setItem('correo', correo);
        localStorage.setItem('rolUsuario', 'usuario');
        authModal.style.display = 'none';
        showToast(` ¡Bienvenid@, ${usuario} 🎉!`);
        mostrarPerfilFlotante();
    });

    // PERFIL FLOTANTE
    function mostrarPerfilFlotante() {
        const usuario = localStorage.getItem('usuarioLogueado');
        const correo = localStorage.getItem('correo');
        const userProfile = document.getElementById('user-profile');
        const perfilUsuario = document.getElementById('perfil-usuario');
        const perfilCorreo = document.getElementById('perfil-correo');
        if (usuario && userProfile && perfilUsuario) {
            userProfile.style.display = 'block';
            perfilUsuario.textContent = usuario;
            if (perfilCorreo) perfilCorreo.textContent = correo || '';
        }
    }

    // Botón cerrar perfil (la X)
document.getElementById('cerrar-perfil')?.addEventListener('click', function() {
    document.getElementById('user-profile').style.display = 'none';
});

    // Cerrar sesión
    const cerrarSesionBtn = document.getElementById('cerrar-sesion');
    cerrarSesionBtn?.addEventListener('click', () => {
        const usuario = localStorage.getItem('usuarioLogueado') || '';
        const rol = localStorage.getItem('rolUsuario') || '';
        if (rol === 'admin') {
            showToast(`👋 El administrador: ${usuario} cerró sesión.`);
        } else {
            showToast(`👋 El usuario ${usuario} cerró sesión.`);
        }
        localStorage.clear();
        setTimeout(() => {
            location.reload();
        }, 1500);
    });

    mostrarPerfilFlotante();
});

// --- CARRITO ---
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart');
const cartItemsList = document.getElementById('cart-items');
const enviarPedidoBtn = document.getElementById('enviar-pedido');
const vaciarCarritoBtn = document.createElement('button');
vaciarCarritoBtn.id = 'vaciar-carrito';
vaciarCarritoBtn.innerText = 'Limpiar';
vaciarCarritoBtn.style.cssText = 'background:#dc3545; color:#fff; border:none; border-radius:6px; padding:10px 18px; margin-top:10px; font-weight:bold; cursor:pointer;';

const cartTotal = document.createElement('p');
cartTotal.id = 'cart-total';
cartTotal.style.cssText = 'margin: 10px 0; font-weight: bold;';

const cartContent = document.querySelector('.cart-content');
cartContent.insertBefore(cartTotal, enviarPedidoBtn);
cartContent.insertBefore(vaciarCarritoBtn, enviarPedidoBtn);

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function renderizarCarrito() {
    cartItemsList.innerHTML = '';
    let total = 0;

    carrito.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${item.img}" style="width: 50px; vertical-align: middle;"> 
            <strong>${item.name}</strong> x${item.cantidad} - $${item.price.toLocaleString()} c/u
        `;
        cartItemsList.appendChild(li);
        total += item.price * item.cantidad;
    });

    cartTotal.innerText = `Total: $${total.toLocaleString()}`;

    if (carrito.length === 0) {
        cartItemsList.innerHTML = '<p>El carrito está vacío.</p>';
        cartTotal.innerText = '';
    }
}

function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.name === producto.name);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
    showToast('Producto agregado al carrito🛒');
}

function showToast(msg) {
    const toast = document.getElementById('toast-message');
    toast.className = 'toast-message';
    if (msg.includes('Pedido enviado')) {
        toast.classList.add('toast-success');
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}

// Capturar clic en botones de producto
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        const img = btn.dataset.img;
        agregarAlCarrito({ name, price, img });
    });
});

// Abrir/cerrar modal
cartBtn.addEventListener('click', () => {
    renderizarCarrito();
    cartModal.classList.add('show');
});

closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
});

// Vaciar carrito
vaciarCarritoBtn.addEventListener('click', () => {
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    showToast(' Carrito limpio ');
});

// Enviar pedido (demo)
enviarPedidoBtn.addEventListener('click', () => {
    if (carrito.length === 0) return alert('El carrito está vacío:');
    showToast(' Pedido enviado con éxito ✅');
    carrito = [];
    localStorage.removeItem('carrito');
    renderizarCarrito();
    cartModal.classList.remove('show');
});

// Menú responsive
document.getElementById("menu-toggle").addEventListener("click", function() {
    document.getElementById("nav-links").classList.toggle("active");
});


// Mostrar el contenedor de perfil al hacer clic en el avatar flotante
document.getElementById('avatar-flotante').addEventListener('click', function() {
    document.getElementById('user-profile').style.display = 'block';
    // Sincroniza el avatar del popup con el flotante
    document.getElementById('avatar-perfil-popup').src = document.getElementById('avatar-perfil').src;
});

// Cerrar el contenedor de perfil con la X
document.getElementById('cerrar-perfil').addEventListener('click', function() {
    document.getElementById('user-profile').style.display = 'none';
});

// Mostrar datos en el perfil flotante
function mostrarPerfilFlotante() {
    const usuario = localStorage.getItem('usuarioLogueado');
    const correo = localStorage.getItem('correo');
    const avatarFlotante = document.getElementById('avatar-flotante');
    const perfilUsuario = document.getElementById('perfil-usuario');
    const perfilCorreo = document.getElementById('perfil-correo');
    if (usuario && avatarFlotante && perfilUsuario) {
        avatarFlotante.style.display = 'block';
        perfilUsuario.textContent = usuario;
        if (perfilCorreo) perfilCorreo.textContent = correo || '';
    } else if (avatarFlotante) {
        avatarFlotante.style.display = 'none';
    }
}

// Botón cerrar sesión
document.getElementById('cerrar-sesion').addEventListener('click', function() {
    const usuario = localStorage.getItem('usuarioLogueado') || '';
    const rol = localStorage.getItem('rolUsuario') || '';
    if (rol === 'admin') {
        showToast(`👋 El administrador: ${usuario} cerró sesión.`);
    } else {
        showToast(`👋 El usuario ${usuario} cerró sesión.`);
    }
    localStorage.clear();
    setTimeout(() => {
        location.reload();
    }, 1500);
});

// Llama a mostrarPerfilFlotante al cargar
mostrarPerfilFlotante();


// Botón login admin
const btnAdminIngresar = document.getElementById('btn-admin-ingresar');
btnAdminIngresar?.addEventListener('click', () => {
    const usuario = document.getElementById('admin-login-usuario').value.trim();
    const contrasena = document.getElementById('admin-login-contrasena').value.trim();

    // Usuario y contraseña fijos para admin
    const adminUser = 'JOSE';
    const adminPass = '2005';

    if (!usuario || !contrasena) {
        alert("Completa todos los campos.");
        return;
    }

    if (usuario === adminUser && contrasena === adminPass) {
        localStorage.setItem('usuarioLogueado', usuario);
        localStorage.setItem('rolUsuario', 'admin');
        document.getElementById('admin-login-modal').style.display = 'none';
        showToast(`Bienvenido, Admin ${usuario}🎉`);
        mostrarPerfilFlotante();
    } else {
        alert('Usuario o contraseña de administrador incorrectos.');
    }
});