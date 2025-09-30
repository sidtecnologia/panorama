/**
 * @license
 * Copyright © 2025 Tecnología y Soluciones Informáticas. Todos los derechos reservados.
 *
 * SUPERMERCADO PANORAMA PWA
 *
 * Este software es propiedad confidencial y exclusiva de TECSIN.
 * El permiso de uso de este software es temporal para pruebas en Supermercados Panorama.
 *
 * Queda estrictamente prohibida la copia, modificación, distribución,
 * ingeniería inversa o cualquier otro uso no autorizado de este código
 * sin el consentimiento explícito por escrito del autor.
 *
 * Para más información, contactar a: sidsoporte@proton.me
 */

// Importar funciones de Supabase
const { createClient } = supabase;

// --- Variables de estado ---
let cart = [];
let products = [];
let currentImageIndex = 0;
let supabaseClient = null;

// Referencias a elementos del DOM
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const productGrid = document.getElementById('product-grid');
const categoryCarousel = document.getElementById('category-carousel');
const sectionTitles = document.getElementById('section-titles');
const mainContent = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const whatsappBtn = document.getElementById('whatsapp-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('close-btn');
const installBanner = document.getElementById('install-banner');
const installPromptBtn = document.getElementById('install-prompt-btn');
const installCloseBtn = document.getElementById('install-close-btn');
let deferredPrompt;

// Elementos del modal de pago (Checkout)
const confirmOrderBtn = document.getElementById('confirm-order-btn');
const clientNameInput = document.getElementById('client-name');
const clientPhoneInput = document.getElementById('client-phone');
const clientAddressInput = document.getElementById('client-address');
const paymentMethodSelect = document.getElementById('payment-method');


// --- Lógica del Carrito ---

const updateCart = () => {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 p-4">El carrito está vacío.</p>';
        cartTotalElement.textContent = '0.00';
        whatsappBtn.classList.add('opacity-50', 'cursor-not-allowed');
        return;
    }

    whatsappBtn.classList.remove('opacity-50', 'cursor-not-allowed');

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'flex items-center justify-between py-2 border-b';
        itemElement.innerHTML = `
            <div class="flex-grow">
                <p class="font-semibold text-sm">${item.name}</p>
                <p class="text-xs text-gray-500">$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="changeQuantity('${item.id}', -1)" class="bg-red-500 text-white w-6 h-6 rounded-full text-sm">-</button>
                <span class="font-bold">${item.quantity}</span>
                <button onclick="changeQuantity('${item.id}', 1)" class="bg-green-500 text-white w-6 h-6 rounded-full text-sm">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalElement.textContent = total.toFixed(2);
};

const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            unit: product.unit || 'unidad'
        });
    }
    updateCart();
    showNotification(`${product.name} añadido al carrito.`);
};

const changeQuantity = (productId, delta) => {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += delta;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCart();
};

const getCartSummary = () => {
    const items = cart.map(item =>
        `${item.quantity} ${item.unit} de ${item.name} a $${item.price.toFixed(2)} c/u.`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    return `*--- Resumen de la Orden ---*\n\n${items}\n\n*Total a pagar: $${total}*\n\n*Por favor, proporciona tus datos de envío:*`;
};

// --- Funciones de Interfaz (UI) ---

const showNotification = (message) => {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
};

const generateProductCard = (product) => {
    return `
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] border border-gray-100 flex flex-col justify-between" onclick="showProductDetails('${product.id}')">
            <div>
                <img src="${product.image_url || 'https://placehold.co/400x300/e0e0e0/000000?text=Producto'}" alt="${product.name}" class="w-full h-32 object-contain mb-3 rounded-md onerror="this.onerror=null;this.src='https://placehold.co/400x300/e0e0e0/000000?text=Producto';"">
                <h3 class="font-bold text-sm mb-1 line-clamp-2">${product.name}</h3>
                <p class="text-xs text-gray-500">${product.category}</p>
            </div>
            <div class="mt-3 flex items-center justify-between">
                <span class="text-lg font-extrabold text-green-700">$${product.price.toFixed(2)}</span>
                <button onclick="event.stopPropagation(); addToCart('${product.id}')" class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700 transition duration-150 shadow-md">
                    + Agregar
                </button>
            </div>
        </div>
    `;
};

const renderProducts = (filteredProducts) => {
    productGrid.innerHTML = filteredProducts.map(generateProductCard).join('');
};

const generateCategoryCarousel = () => {
    const categories = [...new Set(products.map(p => p.category))].sort();

    categoryCarousel.innerHTML = categories.map(category => `
        <button onclick="filterByCategory('${category}')" class="flex-shrink-0 bg-white border border-blue-500 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:bg-blue-50 transition duration-150 whitespace-nowrap">
            ${category}
        </button>
    `).join('');
};

const filterByCategory = (category) => {
    const filtered = products.filter(p => p.category === category);
    renderProducts(filtered);
    sectionTitles.textContent = category;
    searchInput.value = '';
};

const showDefaultSections = () => {
    renderProducts(products); // Mostrar todos por defecto
    sectionTitles.textContent = 'Todos los Productos';
};

// --- Manejo de Búsqueda ---

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
        showDefaultSections();
        return;
    }
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderProducts(filtered);
    sectionTitles.textContent = `Resultados para "${e.target.value}"`;
});

// --- Manejo de Modales y Pedido ---

const showModal = (contentHTML) => {
    document.getElementById('modal-content-wrapper').innerHTML = contentHTML;
    modalOverlay.classList.remove('hidden');
};

const closeModal = () => {
    modalOverlay.classList.add('hidden');
    // Limpiar campos del formulario si están presentes
    if(clientNameInput) clientNameInput.value = '';
    if(clientPhoneInput) clientPhoneInput.value = '';
    if(clientAddressInput) clientAddressInput.value = '';
    if(paymentMethodSelect) paymentMethodSelect.value = 'efectivo';
};

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

const openCheckoutModal = () => {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío. Agrega productos primero.');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

    const checkoutHTML = `
        <h2 class="text-2xl font-bold mb-4 text-center text-blue-600">Finalizar Pedido</h2>
        <p class="text-center mb-6 text-xl font-extrabold">Total a Pagar: <span class="text-green-600">$${total}</span></p>
        
        <div class="space-y-4">
            <input type="text" id="client-name" placeholder="Tu Nombre Completo" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
            <input type="tel" id="client-phone" placeholder="Número de Teléfono (WhatsApp)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
            <input type="text" id="client-address" placeholder="Dirección de Envío Completa" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" required>
            
            <select id="payment-method" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="efectivo">Efectivo al Recibir</option>
                <option value="transferencia">Transferencia Bancaria</option>
            </select>
        </div>

        <div class="mt-6">
            <button id="confirm-order-btn" class="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition duration-150 shadow-lg">
                Confirmar y Procesar Orden
            </button>
        </div>
    `;
    showModal(checkoutHTML);
};

// Evento para abrir el modal de Checkout
whatsappBtn.addEventListener('click', openCheckoutModal);

// --- Función clave: Procesamiento de Orden (Llama al API Route) ---
const processOrder = async () => {
    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const address = document.getElementById('client-address').value.trim();
    const paymentMethod = document.getElementById('payment-method').value;
    const total = parseFloat(cartTotalElement.textContent);
    const btn = document.getElementById('confirm-order-btn');

    if (!name || !phone || !address) {
        showNotification('Por favor, completa todos tus datos de contacto y envío.');
        return;
    }

    if (cart.length === 0) {
        showNotification('El carrito está vacío.');
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Procesando...';
    btn.classList.remove('bg-green-600');
    btn.classList.add('bg-gray-400');

    try {
        const orderData = {
            clientName: name,
            clientPhone: phone,
            clientAddress: address,
            paymentMethod: paymentMethod,
            cart: cart, // Envía la lista de productos
            total: total
        };

        const response = await fetch('/api/place-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Manejar errores de Serverless (Códigos 4xx, 5xx)
            throw new Error(result.error || 'Error desconocido al procesar el pedido.');
        }

        // Éxito:
        showNotification('¡Orden procesada con éxito! Revisa tu WhatsApp para la confirmación.');
        closeModal();
        cart = []; // Limpiar carrito
        updateCart(); // Actualizar UI
        
        // Abrir WhatsApp con la confirmación si es necesario, usando los datos del cliente
        const whatsappMessage = `¡Hola! Mi orden #${result.orderId || 'PENDIENTE'} fue confirmada y pagada con ${paymentMethod}. Mi nombre es ${name}. Total: $${total.toFixed(2)}.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');


    } catch (error) {
        console.error('Fallo en el pedido:', error);
        showNotification(`Error al procesar el pedido: ${error.message}. Por favor, inténtalo de nuevo.`);
        
    } finally {
        btn.disabled = false;
        btn.textContent = 'Confirmar y Procesar Orden';
        btn.classList.remove('bg-gray-400');
        btn.classList.add('bg-green-600');
    }
};


// Event listener para el botón de confirmar pago (DEBE estar dentro del DOMContentLoaded o ser asignado dinámicamente)
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'confirm-order-btn') {
        processOrder();
    }
});


// --- Lógica de Inicialización de Supabase (Ocultar Credenciales) ---

const validateSupabaseUrl = (url) => {
    if (!url || !url.startsWith('http')) {
        throw new Error('supabaseUrl is required.');
    }
};

const loadConfigAndInitSupabase = async () => {
    try {
        const response = await fetch('/api/get-config');
        const config = await response.json();

        if (!response.ok) {
            throw new Error(config.error || 'El API Route no retornó las claves de Supabase. Revisa las Variables de Entorno en Vercel.');
        }

        validateSupabaseUrl(config.url);

        supabaseClient = createClient(config.url, config.anonKey);
        
        return true;

    } catch (error) {
        // Manejo de error crítico
        console.error('Error FATAL al iniciar la aplicación:', error.message);
        const main = document.getElementById('main-content');
        if (main) {
            main.innerHTML = `<div class="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg mx-4 mt-8 text-center">
                <h1 class="text-2xl font-bold mb-2">Error de Configuración</h1>
                <p>No se pudo cargar la configuración de la base de datos.</p>
                <p class="mt-2">Detalle: ${error.message}</p>
                <p class="mt-4 text-sm">Por favor, contacta al administrador del sistema.</p>
            </div>`;
        }
        return false;
    }
};

const fetchProductsFromSupabase = async () => {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*');
        if (error) {
            throw error;
        }
        return data;
    } catch (err) {
        console.error('Error al cargar los productos:', err.message);
        // Usamos una notificación en lugar de alert
        showNotification('Hubo un error al cargar los productos. Revisa la consola para más detalles.');
        return [];
    }
};

// --- Iniciar la aplicación después de cargar los datos ---
document.addEventListener('DOMContentLoaded', async () => {
    const isConfigLoaded = await loadConfigAndInitSupabase();
    
    if (isConfigLoaded) {
        products = await fetchProductsFromSupabase();
        if (products.length > 0) {
            showDefaultSections();
            generateCategoryCarousel();
        }
    }
    updateCart();

    // Lógica para PWA (instalación)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBanner) installBanner.classList.add('visible');
    });

    installPromptBtn && installPromptBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        installBanner.classList.remove('visible');
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
    });

    installCloseBtn && installCloseBtn.addEventListener('click', () => installBanner.classList.remove('visible'));
});
