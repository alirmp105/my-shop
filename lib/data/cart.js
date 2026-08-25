import Cart from "@/models/Cart";
import Product from "@/models/Product";

const cartPopulate = {
  path: "items.product",
  select: "name slug price stock images",
};

export async function getCartByUserId(userId) {
  const cart = await Cart.findOne({
    user: userId,
  }).populate(cartPopulate);

  return cart;
}

export async function addCartItem(userId, productId, quantity = 1) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock <= 0) {
    throw new Error("Product is out of stock");
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = new Cart({
      user: userId,
      items: [],
      totalPrice: 0,
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock");
    }

    existingItem.quantity = newQuantity;

    // قیمت فعلی Product
    existingItem.price = product.price;
  } else {
    if (quantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock");
    }

    cart.items.push({
      product: product._id,
      quantity,
      price: product.price,
    });
  }

  await cart.save();

  await cart.populate(cartPopulate);

  return cart;
}

export async function updateCartItem(
  userId,
  productId,
  quantity
) {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error("Requested quantity exceeds available stock");
  }

  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    return null;
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId.toString()
  );

  if (!item) {
    return null;
  }

  item.quantity = quantity;
  item.price = product.price;

  await cart.save();

  await cart.populate(cartPopulate);

  return cart;
}

export async function removeCartItem(userId, productId) {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    return null;
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );

  await cart.save();

  await cart.populate(cartPopulate);

  return cart;
}