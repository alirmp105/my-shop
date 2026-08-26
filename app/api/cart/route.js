import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {connectDB} from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { authOptions } from "@/lib/auth";
import { updateCartItem } from "@/lib/data/cart";
import { removeCartItem } from "@/lib/data/cart";

export async function POST(request) {
  try {
    await connectDB();

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    // const userId = session.user.id;
    console.log("session : " , session);
    

    // Get request body
    const body = await request.json();
    console.log("body :  " , body);
    

    const { productId, quantity = 1 } = body;
  console.log("body :  " , body);
    // Validate productId
    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be a positive integer",
        },
        { status: 400 }
      );
    }

    // Find product
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 }
      );
    }

    // Check stock
    if (product.stock < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Product is out of stock",
        },
        { status: 400 }
      );
    }

    // Find user's cart
    let cart = await Cart.findOne({
      user: session.user.id,
    });

    // Create cart if it doesn't exist
    if (!cart) {
      cart = new Cart({
        user: session.user.id,
        items: [],
        totalPrice: 0,
      });
    }

    // Check whether product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // Prevent quantity from exceeding stock
      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message:` Only ${product.stock} items are available`,
          },
          { status: 400 }
        );
      }

      existingItem.quantity = newQuantity;

      // Update price to current product price
      existingItem.price = product.price;
    } else {
      // Prevent requested quantity from exceeding stock
      if (quantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${product.stock} items are available`,
          },
          { status: 400 }
        );
      }

      cart.items.push({
        product: product._id,
        quantity,
        price: product.price,

      });
    }

    // Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name slug price stock images",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product added to cart successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Add to cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}




export async function GET() {
  try {
    await connectDB();

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: session.user.id,
    }).populate({
      path: "items.product",
      select: "name slug price stock images",
    });

    // User doesn't have a cart yet
    if (!cart) {
      return NextResponse.json(
        {
          success: true,
          cart: {
            items: [],
            totalPrice: 0,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { productId, quantity } = body;

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    if (
      quantity === undefined ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Quantity must be an integer greater than 0",
        },
        { status: 400 }
      );
    }

    const cart = await updateCartItem(
      session.user.id,
      productId,
      quantity
    );

    return NextResponse.json(
      {
        success: true,
        message: "Cart updated successfully",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to update cart",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    const cart = await removeCartItem(
      session.user.id,
      productId
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product removed from cart",
        cart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Failed to remove cart item",
      },
      { status: 500 }
    );
  }
}