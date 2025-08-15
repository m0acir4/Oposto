document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // NOSSA "BASE DE DADOS" DE PRODUTOS COM CORES
    // =======================================================
    const produtos = {
        "jesus-is-king": {
            name: "Camisa Jesus Is King 👑",
            price: 89.90,
            description: "Camiseta de alta qualidade, 100% algodão fio 30.1 penteado. Estampa em Silk HD na frente e nas costas, feita com tinta Plastisol que garante durabilidade e cores vivas. Uma peça de estilo e fé.",
            images: [
                "/image/Blusa Jesus is king.PNG",
                "/image/Blusa Jesus is king 1.PNG",
                "/image/Blusa Jesus is king 2.PNG"
            ],
            colors: ["Preto", "Branco", "Cinza", "Azul Bebê"]
        },
        "yeshua-he-saves": {
            name: "Camisa Yeshua He Saves",
            price: 89.90,
            description: "Demonstre sua fé com estilo. Camiseta com estampa 'Yeshua He Saves', produzida em malha premium 100% algodão. Conforto e mensagem em uma única peça.",
            images: [
                "/image/Camisa Yeshua He Saves.PNG",
                "/image/Camisa Yeshua He Saves 1.PNG",
                "/image/Camisa Yeshua He Saves 2.PNG"
            ],
            colors: ["Preto", "Branco", "Cinza", "Azul Bebê"]
        },
        "jesus-saves": {
            name: "Camisa Jesus Saves",
            price: 89.90,
            description: "Design minimalista e mensagem poderosa. A camisa 'Jesus Saves' é perfeita para o dia a dia, com tecido leve e estampa durável em Silk HD.",
            images: [
                "/image/Camisa Jesus Saves..PNG",
                "/image/Camisa Jesus Saves. 1.PNG",
                "/image/Camisa Jesus Saves. 2.PNG"
            ],
            colors: ["Preto", "Branco", "Cinza", "Azul Bebê"]
        },
        "social-linho": {
            name: "Camisa Social de Linho",
            price: 159.90,
            description: "Elegância e conforto definem nossa camisa social de linho. Perfeita para ocasiões especiais ou para um visual de trabalho sofisticado. Tecido respirável e caimento impecável.",
            images: [
                "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
                "https://images.unsplash.com/photo-1610384104075-e0349819a56a?w=500&q=60",
                "https://images.unsplash.com/photo-1593030103065-b0b37f8a16af?w=500&q=60"
            ],
            colors: ["Branco", "Azul Bebê"]
        }
    };

    // LÓGICA PARA DECIDIR QUAL PÁGINA ESTAMOS
    if (document.body.classList.contains('pagina-produto')) {
        carregarPaginaProduto();
    }
    if (document.body.classList.contains('pagina-home')) {
        carregarPaginaHome();
    }

    // LÓGICA DA PÁGINA HOME
    function carregarPaginaHome() {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;
        productGrid.innerHTML = '';
        for (const id in produtos) {
            const produto = produtos[id];
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <a href="produto.html?id=${id}" class="product-link">
                    <img src="${produto.images[0]}" alt="${produto.name}">
                    <div class="product-card-content">
                        <h3>${produto.name}</h3>
                        <p class="price">R$ ${produto.price.toFixed(2).replace('.', ',')}</p>
                        <span class="view-product-btn">Ver Produto</span>
                    </div>
                </a>
            `;
            productGrid.appendChild(productCard);
        }
    }

    // LÓGICA DA PÁGINA DE PRODUTO
    function carregarPaginaProduto() {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get('id');
        const produto = produtos[productId];

        if (!produto) {
            document.querySelector('main').innerHTML = '<h1>Produto não encontrado!</h1>';
            return;
        }

        document.getElementById('product-name').textContent = produto.name;
        document.getElementById('product-price').textContent = `R$ ${produto.price.toFixed(2).replace('.', ',')}`;
        document.getElementById('product-description').textContent = produto.description;
        document.getElementById('main-product-image').src = produto.images[0];
        
        const thumbnailsContainer = document.getElementById('product-thumbnails');
        thumbnailsContainer.innerHTML = '';
        produto.images.forEach(imgSrc => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = "Thumbnail";
            thumb.classList.add('thumbnail');
            thumb.addEventListener('click', () => {
                document.getElementById('main-product-image').src = imgSrc;
            });
            thumbnailsContainer.appendChild(thumb);
        });

        const colorsContainer = document.getElementById('product-colors');
        colorsContainer.innerHTML = '';
        produto.colors.forEach((color, index) => {
            const colorOption = document.createElement('div');
            colorOption.classList.add('color-option');
            colorOption.dataset.color = color;
            colorOption.textContent = color;
            if (index === 0) {
                colorOption.classList.add('active');
            }
            colorOption.addEventListener('click', () => {
                colorsContainer.querySelector('.color-option.active').classList.remove('active');
                colorOption.classList.add('active');
            });
            colorsContainer.appendChild(colorOption);
        });

        document.getElementById('product-add-to-cart').addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const selectedColor = colorsContainer.querySelector('.color-option.active').dataset.color;
            addToCart(productId, selectedColor, quantity);
            showToast(`${quantity}x ${produto.name} (${selectedColor}) adicionado(s) ao carrinho!`);
        });
    }

    // =======================================================
    // LÓGICA DO CARRINHO (COMPARTILHADA E ATUALIZADA)
    // =======================================================
    const cartModal = document.getElementById('cart-modal');
    const closeButton = document.querySelector('.close-button');
    const cartIcon = document.querySelector('.cart-icon-container');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function showToast(message) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }
    
    const openCart = () => cartModal && cartModal.classList.add('show');
    const closeCart = () => cartModal && cartModal.classList.remove('show');

    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let totalItems = 0;

        cart.forEach(item => {
            const produtoInfo = produtos[item.id];
            const itemSubtotal = produtoInfo.price * item.quantity;
            subtotal += itemSubtotal;
            totalItems += item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${produtoInfo.images[0]}" alt="${produtoInfo.name}">
                <div class="cart-item-info">
                    <h4>${produtoInfo.name}</h4>
                    <p>Cor: ${item.color}</p>
                    <p class="cart-item-price">R$ ${produtoInfo.price.toFixed(2).replace('.', ',')}</p>
                    <div class="cart-quantity-controls">
                        <button class="quantity-btn" data-id="${item.id}" data-color="${item.color}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-color="${item.color}" data-action="increase">+</button>
                    </div>
                </div>
                <button class="remove-item-button" data-id="${item.id}" data-color="${item.color}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);
        });

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        }

        cartCounter.textContent = totalItems;
        cartSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToCart(productId, color, quantity) {
        const cartItemId = `${productId}-${color}`;
        const existingItem = cart.find(item => `${item.id}-${item.color}` === cartItemId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, color: color, quantity: quantity });
        }
        updateCartDisplay();
    }

    function handleQuantityChange(productId, color, action) {
        const cartItemId = `${productId}-${color}`;
        const itemInCart = cart.find(item => `${item.id}-${item.color}` === cartItemId);
        if (!itemInCart) return;

        if (action === 'increase') {
            itemInCart.quantity++;
        } else if (action === 'decrease') {
            itemInCart.quantity--;
            if (itemInCart.quantity <= 0) {
                removeFromCart(productId, color);
                return;
            }
        }
        updateCartDisplay();
    }
    
    function removeFromCart(productId, color) {
        const cartItemId = `${productId}-${color}`;
        cart = cart.filter(item => `${item.id}-${item.color}` !== cartItemId);
        updateCartDisplay();
    }
    
    // Event Listeners Globais
    if (cartIcon) cartIcon.addEventListener('click', openCart);
    if (closeButton) closeButton.addEventListener('click', closeCart);
    window.addEventListener('click', (event) => {
        if (event.target == cartModal) closeCart();
    });

    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('remove-item-button')) {
                removeFromCart(target.dataset.id, target.dataset.color);
            }
            if (target.classList.contains('quantity-btn')) {
                handleQuantityChange(target.dataset.id, target.dataset.color, target.dataset.action);
            }
        });
    }
    
    // ===============================================
    // CÓDIGO DO CHECKOUT AGORA COMPLETO E FUNCIONAL
    // ===============================================
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('Seu carrinho está vazio!');
                return;
            }
    
            const whatsAppNumber = "5585991309643";
            const shippingOption = document.querySelector('input[name="shipping"]:checked').value;
            const paymentMethod = document.getElementById('payment-method').value;
    
            let message = "Olá, OPOSTO! Gostaria de fazer o seguinte pedido:\n\n";
            let total = 0;
    
            cart.forEach(item => {
                const produtoInfo = produtos[item.id];
                message += `*Produto:* ${produtoInfo.name}\n`;
                message += `*Cor:* ${item.color}\n`;
                message += `*Quantidade:* ${item.quantity}\n`;
                message += `*Preço Unitário:* R$ ${produtoInfo.price.toFixed(2).replace('.', ',')}\n\n`;
                total += produtoInfo.price * item.quantity;
            });
    
            message += `*Subtotal:* R$ ${total.toFixed(2).replace('.', ',')}\n`;
            message += `*Opção de Entrega:* ${shippingOption}\n`;
            message += `*Forma de Pagamento:* ${paymentMethod}\n\n`;
            message += "Aguardo as instruções para finalizar a compra. Obrigado!";
    
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsAppNumber}?text=${encodedMessage}`;
    
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Carrega o carrinho em qualquer página que esteja
    updateCartDisplay();
});