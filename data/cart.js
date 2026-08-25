export async function addToCart(productId, quantity = 1) {
  const response = await fetch("api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error ("خطایی در افزودن به سبد خرید پیش آمده")
  }
  return data;
}
