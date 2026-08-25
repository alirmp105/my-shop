const CART_API_URL = "/api/cart";

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong"
    );
  }

  return data;
}

export async function fetchCart() {
  const response = await fetch(CART_API_URL);

  return handleResponse(response);
}

export async function addToCart(productId, quantity = 1) {
  const response = await fetch(CART_API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  return handleResponse(response);
}

export async function updateCartItem(
  productId,
  quantity
) {
  const response = await fetch(CART_API_URL, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  return handleResponse(response);
}

export async function removeFromCart(productId) {
  const response = await fetch(CART_API_URL, {
    method: "DELETE",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      productId,
    }),
  });

  return handleResponse(response);
}