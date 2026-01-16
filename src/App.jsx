import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { shuffleArray, money } from './utils/helpers';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import CategoryCarousel from './components/CategoryCarousel';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import SuccessModal from './components/SuccessModal';
import InstallBanner from './components/InstallBanner';
import AdsSection from './components/AdsSection';
import Toast from './components/Toast';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [view, setView] = useState('default');
  const [searchTitle, setSearchTitle] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      const confirmClose = window.confirm('¿Seguro que quieres salir de la aplicación?');
      if (!confirmClose) {
        e.returnValue = '';
      } else {
        e.returnValue = undefined;
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleSearch = (q) => {
    const query = q.trim().toLowerCase();
    if (!query) {
      setView('default');
      return;
    }
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setSearchTitle(`Resultados para "${query}"`);
    setView('filtered');
  };

  const handleCategorySelect = (cat) => {
    if (cat === '__all') {
      setView('default');
      return;
    }
    const filtered = products.filter(p => p.category.toLowerCase() === cat.toLowerCase());
    setFilteredProducts(filtered);
    setSearchTitle(cat);
    setView('filtered');
  };

  const addToCart = (product, qty) => {
    const availableStock = product.stock || 0;
    const existing = cart.find(i => i.id === product.id);
    const currentQty = existing ? existing.qty : 0;

    if (currentQty + qty > availableStock) {
      alert(`En el momento solo quedan ${availableStock} unidades.`);
      return;
    }

    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i));
    } else {
      setCart([...cart, { ...product, qty, image: product.image[0] }]);
    }

    const newToast = {
      id: Date.now(),
      name: product.name,
      image: product.image[0]
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateCartQty = (idx, change) => {
    const item = cart[idx];
    const original = products.find(p => p.id === item.id);

    if (change > 0 && item.qty + 1 > (original.stock || 0)) {
      alert(`En el momento solo quedan ${original.stock} unidades.`);
      return;
    }

    const newQty = item.qty + change;
    if (newQty <= 0) {
      setCart(cart.filter((_, i) => i !== idx));
    } else {
      setCart(cart.map((it, i) => i === idx ? { ...it, qty: newQty } : it));
    }
  };

  const handleFinalizeOrder = async (details) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    const finalOrder = {
      created_at: new Date(),
      customer_name: details.name,
      customer_address: details.address,
      payment_method: details.payment,
      total_amount: total,
      order_items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
      payment_status: 'Pendiente',
      is_fiscal: details.is_fiscal,
      document_type: details.documentType || null,
      document_number: details.documentNumber || null,
      email: details.email || null,
      phone: details.phone || null,
      legal_org_id: details.legal_organization_id || null,
      api_message: null
    };

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('orders')
        .insert([finalOrder])
        .select();

      if (error) throw error;

      setOrderDetails((data && data[0]) ? data[0] : finalOrder);
      
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setCart([]);

    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error al guardar el pedido: " + (error.message || error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = async () => {
    if (!orderDetails) return;
    setIsLoading(true);

    try {
      try {
        await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderDetails: orderDetails,
            products: products
          }),
        });
      } catch (err) {
        console.log("Backend notification skipped or failed", err);
      }

      const whatsappNumber = '573227671829';
      
      let message = `Hola, mi nombre es ${orderDetails.customer_name}\n`;
      message += `Dirección: ${orderDetails.customer_address}\n`;
      message += `Método de pago: ${orderDetails.payment_method}\n`;
      
      if (orderDetails.is_fiscal) {
         message += `📝 Solicitud de Factura Electrónica (Tipo: ${orderDetails.document_type} - ${orderDetails.document_number})\n`;
      }
      
      message += `\nPedido:\n`;
      const items = orderDetails.order_items || [];
      items.forEach(item => {
        message += `- ${item.name} x${item.qty} = $${money(item.price * item.qty)}\n`;
      });
      message += `\nTotal: $${money(orderDetails.total_amount)}`;

      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

      setOrderDetails(null);
      await fetchProducts();
      setView('default');
    } catch (e) {
      alert('Error: ' + (e.message || e));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAdProduct = (id) => {
    const product = products.find(p => p.id === id);
    if(product) setSelectedProduct(product);
  }

  const renderProductGrid = (list) => (
    <div className="product-grid">
      {list.length === 0 ? <p className="empty-cart-msg">No se encontraron productos.</p> :
        list.map(p => <ProductCard key={p.id} product={p} onOpenModal={setSelectedProduct} />)
      }
    </div>
  );

  return (
    <>
      {isLoading && <LoadingScreen />}

      <div className="page-container" style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <div className="toast-container">
          {toasts.map(t => (
            <Toast key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>

        <Navbar
          cartCount={cart.reduce((a, b) => a + b.qty, 0)}
          onSearch={handleSearch}
          onOpenCart={() => setIsCartOpen(true)}
        />

        <div className="main-carousel-wrapper">
          <BannerCarousel />
        </div>

        <div className="ticker-wrapper">
          <div className="ticker-text">
            <span>Supermercados Panorama APP</span>
            <span>Envío Gratis En Compras Superiores A $150.000 ✨</span>
            <span>Descuentos Del 20% En Productos Seleccionados 🔥</span>
            <span>Nuevos Productos Ya Disponibles 🚀</span>
          </div>
        </div>

        <CategoryCarousel products={products} onSelectCategory={handleCategorySelect} />

        <main className="menu-container">
          {view === 'filtered' ? (
            <section className="menu-section">
              <h2 className="section-title">{searchTitle}</h2>
              {renderProductGrid(filteredProducts)}
            </section>
          ) : (
            <>
              <section className="menu-section">
                <h2 className="section-title">Productos Destacados</h2>
                {renderProductGrid(shuffleArray(products.filter(p => p.featured)).slice(0, 25))}
              </section>

              <AdsSection onOpenProduct={handleOpenAdProduct} />

              <section className="menu-section">
                <h2 className="section-title">Ofertas Exclusivas</h2>
                {renderProductGrid(shuffleArray(products.filter(p => p.isOffer)).slice(0, 25))}
              </section>
            </>
          )}
        </main>

        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />

        <CartModal
          isOpen={isCartOpen}
          cart={cart}
          products={products}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={updateCartQty}
          onAddToCart={addToCart}
          onCheckout={() => { if(cart.length === 0) return alert('El carrito está vacío'); setIsCheckoutOpen(true); }}
        />

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onFinalize={handleFinalizeOrder}
          onBackToCart={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }}
        />

        <SuccessModal
          orderDetails={orderDetails}
          onClose={() => setOrderDetails(null)}
          onWhatsApp={handleWhatsApp}
        />

        <footer className="footer-menu">
          <p>&copy; {new Date().getFullYear()} TECSIN Todos los derechos reservados - Supermercados Panorama</p>
        </footer>

        <InstallBanner />
      </div>
    </>
  );
}

export default App;