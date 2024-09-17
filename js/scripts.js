document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM Content Loaded'); // Verificar que el script se está ejecutando sin errores

    // --- Banner de Cookies ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesButton = document.getElementById('acceptCookies');

    if (cookieBanner && acceptCookiesButton) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieBanner.style.display = 'block';
        }

        acceptCookiesButton.addEventListener('click', function () {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- Redirección a Nequi ---
    function redirectToNequi(number) {
        // URL para la redirección en PC
        var urlPC = `https://web.nequi.com.co/pay?number=${number}`;
        // URL para la redirección en móviles
        var urlMobile = `https://paga.nequi.com.co/bdigitalpsp/login`;

        // Verifica si el usuario está en un dispositivo móvil o en una PC
        var isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (isMobile) {
            // Redirige a la URL de Nequi para móviles
            window.location.href = urlMobile;
        } else {
            // Redirige a la URL de Nequi para PC
            window.open(urlPC, '_blank');
        }

        window.location.href = url;
        return false; // Prevenir el comportamiento por defecto del enlace
    }

    // Asumiendo que los enlaces de Nequi están configurados con un atributo `onclick`
    const nequiLinks = document.querySelectorAll('.nequi-link');
    nequiLinks.forEach(link => {
        link.addEventListener('click', function () {
            const phoneNumber = this.getAttribute('data-number');
            redirectToNequi(phoneNumber);
        });
    });

    // --- Carrito de Compras ---
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const checkoutButton = document.getElementById('checkout');

    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }
    }

    function displayCartItems() {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
            totalPriceElement.textContent = 'Precio según cotización';
            return;
        }

        cart.forEach((product, index) => {
            const productItem = document.createElement('div');
            productItem.classList.add('cart-item');
            productItem.innerHTML = `
                <img src="${product.imagen}" alt="${product.nombre}" style="width: 50px; height: 50px;">
                <h3>${product.nombre}</h3>
                <p>Precio según cotización</p>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
            cartItemsContainer.appendChild(productItem);
        });
    }

    function addToCart(producto) {
        cart.push(producto);
        saveCart();
        updateCartCount();
        displayCartItems();
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        displayCartItems();
    }

    function clearCart() {
        cart = [];
        saveCart();
        updateCartCount();
        displayCartItems();
    }

    function checkout() {
        if (cart.length === 0) {
            alert('El carrito está vacío. No puedes finalizar la compra.');
        } else {
            alert('Compra finalizada con éxito.');
            clearCart();
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount();
        displayCartItems();
    }

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', function (event) {
            if (event.target.classList.contains('btn-eliminar')) {
                const index = event.target.getAttribute('data-index');
                removeFromCart(index);
            }
        });
    }

    if (clearCartButton) {
        clearCartButton.addEventListener('click', clearCart);
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const producto = {
                id: this.getAttribute('data-id'),
                nombre: this.getAttribute('data-nombre'),
                precio: parseFloat(this.getAttribute('data-precio')),
                imagen: this.getAttribute('data-imagen')
            };
            addToCart(producto);
        });
    });

    loadCart();

    window.openQueryForm = function (productId) {
        const form = document.getElementById(`query-form-${productId}`);
        if (form) {
            form.style.display = 'block';
        }
    };

    window.closeQueryForm = function (productId) {
        const form = document.getElementById(`query-form-${productId}`);
        if (form) {
            form.style.display = 'none';
        }
    };

    window.onclick = function (event) {
        var forms = document.querySelectorAll('.query-form');
        forms.forEach(function (form) {
            if (event.target === form) {
                form.style.display = 'none';
            }
        });
    };

    // --- Redirección a WhatsApp ---
    function redirectToWhatsApp(phoneNumber, text) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    }

    // --- Función de Enviar Consulta ---
window.sendQuery = function (productId) {
    const queryText = document.getElementById(`query-text-${productId}`).value;
    const whatsappNumber = '573112788191'; // Número de WhatsApp actualizado

    // Obtén el nombre del producto del atributo data-nombre del botón de consulta rápida
    const productName = document.querySelector(`button[data-id="${productId}"]`).getAttribute('data-nombre');

    if (queryText) {
        const whatsappText = `Estoy interesado en el Producto ${productName}, ¿podrían informarme sobre el precio actual? Consulta: ${queryText}`;
        redirectToWhatsApp(whatsappNumber, whatsappText);
        closeQueryForm(productId); // Cierra el formulario después de enviar
    } else {
        alert('Por favor, escribe una consulta antes de enviar.');
    }
};

    // --- Calificación con Estrellas ---
    const starElements = document.querySelectorAll('.star');
    let selectedRating = localStorage.getItem('userRating') || 0;

    function updateStars() {
        starElements.forEach(star => {
            const starValue = parseInt(star.getAttribute('data-value'));
            if (starValue <= selectedRating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
        const ratingMessage = document.getElementById('rating-message');
        if (ratingMessage) {
            ratingMessage.textContent = `Calificación: ${selectedRating} estrellas`;
        }
    }

    starElements.forEach(star => {
        star.addEventListener('click', function () {
            selectedRating = parseInt(this.getAttribute('data-value'));
            updateStars();
        });
    });

    const submitButton = document.getElementById('submit-rating');
    if (submitButton) {
        submitButton.addEventListener('click', function () {
            if (selectedRating > 0) {
                localStorage.setItem('userRating', selectedRating);
                alert('Calificación guardada localmente.');
            } else {
                alert('Por favor, selecciona una calificación antes de enviar.');
            }
        });
    }

    updateStars(); // Actualiza la vista de estrellas al cargar

    // --- Autenticación y Roles ---
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    console.log('Usuario actual:', currentUser);

    function login(username, password) {
        // Simulación de usuarios
        const users = [
            { username: 'admin', password: 'adminpass', role: 'admin' },
            { username: 'user', password: 'userpass', role: 'user' }
        ];

        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log('Login exitoso:', currentUser);
            return true;
        } else {
            console.log('Login fallido');
            return false;
        }
    }

    function logout() {
        localStorage.removeItem('currentUser');
        updateInterface();
    }

    function updateInterface() {
        console.log('Actualizando interfaz para el usuario:', currentUser);
        const adminPanel = document.getElementById('admin-panel');
        const userPanel = document.getElementById('user-panel');
        const loginPanel = document.getElementById('login-panel');

        if (currentUser) {
            if (currentUser.role === 'admin' && adminPanel) {
                adminPanel.style.display = 'block';
                console.log('Mostrando panel de administración');
            } else if (userPanel) {
                userPanel.style.display = 'block';
                console.log('Mostrando panel de usuario');
            }
            if (loginPanel) {
                loginPanel.style.display = 'none';
            }
        } else {
            if (loginPanel) {
                loginPanel.style.display = 'block';
            }
            if (adminPanel) {
                adminPanel.style.display = 'none';
            }
            if (userPanel) {
                userPanel.style.display = 'none';
            }
        }
    }

    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    if (loginButton) {
        loginButton.addEventListener('click', function () {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    updateInterface();

    // Manejo de comentarios
    const commentForm = document.getElementById('commentForm');
    const commentText = document.getElementById('commentText');
    const testimonialList = document.getElementById('testimonial-list');

    if (commentForm && commentText && testimonialList) {
        commentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const comment = commentText.value;
            if (comment) {
                const newTestimonial = document.createElement('div');
                newTestimonial.className = 'testimonial-item';
                newTestimonial.textContent = comment;
                testimonialList.appendChild(newTestimonial);
                commentText.value = ''; // Limpiar el textarea
            }
        });
    }

    // --- Manejo de Modales ---
    document.getElementById('close-modal').onclick = function() {
        document.getElementById('quick-consult-modal').style.display = 'none';
    };

    document.getElementById('close-cart-modal').onclick = function() {
        document.getElementById('modal-cart').style.display = 'none';
    };
});
function redirectToNequi(number) {
    // Si el número es el correcto, cambia la URL de redirección según la plataforma
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    var url = isMobile ? `nequi://pay?number=${number}` : `https://web.nequi.com.co/pay?number=${number}`;
    
    window.location.href = url;
    return false; // Previene el comportamiento por defecto del enlace
}
