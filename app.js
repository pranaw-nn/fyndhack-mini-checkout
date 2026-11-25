(() => {
  const MAX_QTY_PER_PRODUCT = 99;
  const PRODUCTS = [
    { id: "nimbus-notebook", name: "Nimbus Notebook", pricePaise: 24950 },
    { id: "aurora-pen-set", name: "Aurora Pen Set", pricePaise: 7999 }
  ];

  const state = {
    cart: new Map(),
    isSubmitting: false,
    orderCounter: 0
  };

  const productListEl = document.getElementById("product-list");
  const cartBodyEl = document.getElementById("cart-body");
  const emptyCartMessageEl = document.getElementById("empty-cart-message");
  const cartTableEl = document.querySelector("[data-testid='cart-table']");
  const orderTotalEl = document.getElementById("order-total");
  const formEl = document.getElementById("checkout-form");
  const nameInputEl = document.getElementById("customer-name");
  const nameErrorEl = document.getElementById("name-error");
  const cartErrorEl = document.getElementById("cart-error");
  const emptyCartHintEl = document.getElementById("empty-cart-hint");
  const confirmationEl = document.getElementById("confirmation");
  const checkoutButtonEl = document.getElementById("checkout-button");

  function formatINRFromPaise(paise) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR"
    }).format(paise / 100);
  }

  function getProduct(productId) {
    return PRODUCTS.find((product) => product.id === productId);
  }

  function getTotalPaise() {
    let total = 0;
    for (const [productId, qty] of state.cart.entries()) {
      const product = getProduct(productId);
      if (product) {
        total += product.pricePaise * qty;
      }
    }
    return total;
  }

  function updateCheckoutButtonState() {
    const cartEmpty = state.cart.size === 0;
    checkoutButtonEl.disabled = cartEmpty || state.isSubmitting;
  }

  function setCartQuantity(productId, nextQty) {
    const boundedQty = Math.max(0, Math.min(MAX_QTY_PER_PRODUCT, nextQty));
    if (boundedQty <= 0) {
      state.cart.delete(productId);
      return;
    }
    state.cart.set(productId, boundedQty);
  }

  function renderCheckoutHint() {
    if (state.cart.size === 0) {
      emptyCartHintEl.textContent = "Add at least one product to your cart before placing an order.";
    } else {
      emptyCartHintEl.textContent = "";
    }
  }

  function clearErrors() {
    nameErrorEl.textContent = "";
    cartErrorEl.textContent = "";
  }

  function showConfirmation(message) {
    confirmationEl.textContent = message;
    confirmationEl.classList.add("is-visible");
  }

  function clearConfirmation() {
    confirmationEl.textContent = "";
    confirmationEl.classList.remove("is-visible");
  }

  function renderProducts() {
    productListEl.innerHTML = "";

    for (const product of PRODUCTS) {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div>
          <h3>${product.name}</h3>
          <p class="product-price">${formatINRFromPaise(product.pricePaise)}</p>
        </div>
        <button type="button" data-testid="add-${product.id}">Add to Cart</button>
      `;

      const addButton = card.querySelector("button");
      addButton.addEventListener("click", () => {
        const currentQty = state.cart.get(product.id) || 0;
        setCartQuantity(product.id, currentQty + 1);
        clearErrors();
        clearConfirmation();
        renderCart();
      });

      productListEl.appendChild(card);
    }
  }

  function renderCart() {
    cartBodyEl.innerHTML = "";

    for (const [productId, qty] of state.cart.entries()) {
      const product = getProduct(productId);
      if (!product) {
        continue;
      }

      const tr = document.createElement("tr");
      tr.setAttribute("data-testid", `cart-row-${product.id}`);

      const lineTotalPaise = product.pricePaise * qty;

      tr.innerHTML = `
        <td>${product.name}</td>
        <td>${formatINRFromPaise(product.pricePaise)}</td>
        <td>
          <div class="qty-wrap">
            <button type="button" aria-label="Decrease quantity for ${product.name}" data-testid="decrease-${product.id}">-</button>
            <output data-testid="qty-${product.id}">${qty}</output>
            <button type="button" aria-label="Increase quantity for ${product.name}" data-testid="increase-${product.id}">+</button>
          </div>
        </td>
        <td data-testid="line-total-${product.id}">${formatINRFromPaise(lineTotalPaise)}</td>
        <td>
          <button type="button" class="remove-btn" data-testid="remove-${product.id}">Remove</button>
        </td>
      `;

      tr.querySelector(`[data-testid='decrease-${product.id}']`).addEventListener("click", () => {
        const current = state.cart.get(product.id) || 0;
        setCartQuantity(product.id, current - 1);
        clearErrors();
        clearConfirmation();
        renderCart();
      });

      tr.querySelector(`[data-testid='increase-${product.id}']`).addEventListener("click", () => {
        const current = state.cart.get(product.id) || 0;
        if (current >= MAX_QTY_PER_PRODUCT) {
          return;
        }
        setCartQuantity(product.id, current + 1);
        clearErrors();
        clearConfirmation();
        renderCart();
      });

      tr.querySelector(`[data-testid='remove-${product.id}']`).addEventListener("click", () => {
        setCartQuantity(product.id, 0);
        clearErrors();
        clearConfirmation();
        renderCart();
      });

      const increaseButton = tr.querySelector(`[data-testid='increase-${product.id}']`);
      increaseButton.disabled = qty >= MAX_QTY_PER_PRODUCT;

      cartBodyEl.appendChild(tr);
    }

    const totalPaise = getTotalPaise();
    orderTotalEl.textContent = formatINRFromPaise(totalPaise);

    const cartEmpty = state.cart.size === 0;
    emptyCartMessageEl.hidden = !cartEmpty;
    cartTableEl.hidden = cartEmpty;
    renderCheckoutHint();

    updateCheckoutButtonState();
  }

  function generateOrderReference() {
    state.orderCounter += 1;
    const uniquePart = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    return `FYND-${state.orderCounter}-${uniquePart}`.toUpperCase();
  }

  function validateCheckout() {
    clearErrors();

    const name = nameInputEl.value.trim();
    let valid = true;

    if (!name) {
      nameErrorEl.textContent = "Customer name is required to place the order.";
      valid = false;
    }

    if (state.cart.size === 0) {
      cartErrorEl.textContent = "Add at least one product before checkout.";
      valid = false;
    }

    return valid;
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();

    if (state.isSubmitting) {
      return;
    }

    if (!validateCheckout()) {
      updateCheckoutButtonState();
      return;
    }

    state.isSubmitting = true;
    updateCheckoutButtonState();

    const orderReference = generateOrderReference();
    showConfirmation(`Order placed successfully. Reference: ${orderReference}`);

    state.cart.clear();
    state.isSubmitting = false;
    renderCart();
  }

  nameInputEl.addEventListener("input", () => {
    if (nameInputEl.value.trim()) {
      nameErrorEl.textContent = "";
    }
    updateCheckoutButtonState();
  });

  formEl.addEventListener("submit", handleCheckoutSubmit);

  renderProducts();
  renderCart();
})();
