import React, { useState, useEffect, useMemo } from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { API_URL } from "../constans.js";
import PayPalCheckoutButton from "../components/PayPalCheckoutButton.jsx";
import "./css/basketCart.css";

const BasketCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({});
  const [shopOwnerPaypalEmails, setShopOwnerPaypalEmails] = useState({});
  const [shopOwnerInfo, setShopOwnerInfo] = useState({});
  const [paidGroups, setPaidGroups] = useState([]);

  // Fetch customer info and cart items when component mounts
  useEffect(() => {
    fetchCustomerInfo();
    fetchCartItems();
  }, []);

  // Fetch shop owner PayPal emails and info when cart items change
  useEffect(() => {
    const groupedItems = groupItemsByShopOwner(cartItems);
    Object.keys(groupedItems).forEach((userName) => {
      if (!shopOwnerPaypalEmails[userName]) {
        fetchShopOwnerInfo(userName);
      }
    });
  }, [cartItems]);

  const fetchCustomerInfo = async () => {
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        setCustomerInfo(data.userInfo);
      } else {
        throw new Error("Failed to fetch user info");
      }
    } catch (error) {
      setError("Error fetching user info");
      console.error(error);
    }
  };

  const fetchShopOwnerInfo = async (userName) => {
    try {
      const response = await fetch(
        `/userInfo/getWorkerInfoByUserName/${encodeURIComponent(userName)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setShopOwnerPaypalEmails((prevEmails) => ({
          ...prevEmails,
          [userName]: data.workerInfo.paypalEmail,
        }));
        setShopOwnerInfo((prevInfo) => ({
          ...prevInfo,
          [userName]: data.workerInfo, // Store full shop owner info here
        }));
      } else {
        throw new Error("Failed to fetch shop owner info");
      }
    } catch (error) {
      setError("Error fetching shop owner info");
      console.error(error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart data");
      }
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      setError("Error fetching cart data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const groupItemsByShopOwner = (items) => {
    return items.reduce((groups, item) => {
      const { userName } = item;
      if (!groups[userName]) {
        groups[userName] = [];
      }
      groups[userName].push(item);
      return groups;
    }, {});
  };

  const updateCartItemQuantity = async (catalogNumber, newQuantity) => {
    const item = cartItems.find((item) => item.catalogNumber === catalogNumber);
    if (!item) {
      setError("Item not found in the cart");
      return;
    }
    if (newQuantity < 1 || newQuantity > item.amount) {
      alert(`Quantity must be between 1 and ${item.amount}`);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update item amount");
      }
      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      setError("Error updating item amount");
      console.error(error);
    }
  };

  const removeCartItem = async (catalogNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/cart/${encodeURIComponent(catalogNumber)}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }
      const updatedCart = await response.json();
      setCartItems(updatedCart);
    } catch (error) {
      setError("Error removing item from cart");
      console.error(error);
    }
  };

  const handleCheckout = () => {
    const orders = Object.keys(checkoutGroups).map((userName) => {
      const paypalEmail =
        shopOwnerPaypalEmails[userName] || "no-paypal@example.com";
      return {
        paypalEmail,
        items: checkoutGroups[userName],
        userName,
      };
    });
    return orders;
  };

  const temp= (totalAmountForGroup,paypalEmail,merchantId,items,handlePlaceOrder,order )=>{
         console.log(
    "merchantID:",
    merchantId,
    "\nTotalAmount:",
    totalAmountForGroup,
    "\npaypalEmail:",
    paypalEmail,
    "\nitems:",
    items,
    "\nhandlePlaceOrder:",
    handlePlaceOrder
  );
  console.log("order",order)
       return(
    <PayPalCheckoutButton
                      totalAmount={totalAmountForGroup}
                      paypalEmail={paypalEmail}
                      merchantID={merchantId}
                      items={items}
                      handlePlaceOrder={handlePlaceOrder}
                      order={order}
                    />)
     
  }

  const handlePlaceOrder = async (order) => {
      console.log("order >> ",order)
    if (!order || order.items.length===0) {
    
      console.error("Invalid order");
      return;
    }
    try {
      const response = await fetch("/userinfo/getUserInfo", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch user info");

      const customerInfoData = await response.json();
      const { userName, address } = customerInfoData.userInfo;
      if (!userName || !address) {
        alert("Incomplete customer info. Cannot place order.");
        return;
      }

      const orderPayload = {
        userName,
        shippingAddress: address,
        cartItems: order.items.map(({ catalogNumber, quantity }) => ({
          catalogNumber,
          quantity,
        })),
      };
      const placeOrderResponse = await fetch(
        "http://localhost:5000/order/addOrder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        }
      );

      if (!placeOrderResponse.ok) throw new Error("Failed to place order");

      const result = await placeOrderResponse.json();
      alert(`Order placed successfully! Order Number: ${result.orderNumber}`);

      setCartItems((prevItems) =>
        prevItems.filter(
          (cartItem) =>
            !order.items.some(
              (paidItem) => paidItem.catalogNumber === cartItem.catalogNumber
            )
        )
      );

      setPaidGroups((prevPaid) => [...prevPaid, order.userName]);
    } catch (error) {
      setError("Error placing order");
      console.error(error);
    }
  };

  const checkoutGroups = useMemo(
    () => groupItemsByShopOwner(cartItems),
    [cartItems]
  );
  const orders = handleCheckout();

return (
  <div className="div-body">
    <main className="basketCart-container">
      <section className="basketCart-sectionMain">
        <div className="hero-content">
          <h1>Your Cart</h1>
        </div>
      </section>

      <div className="basket-cart-container">
        {cartItems.length === 0 ? (
          <div className="empty-cart-message">
            <p>Your cart is empty. Start shopping now!</p>
          </div>
        ) : (
          orders.map((order) => {
            const { paypalEmail, items } = order;
            const userName = items[0]?.userName || "Unknown Shop Owner";

            // Retrieve shop owner info using the userName
            const ownerInfo = shopOwnerInfo[userName] || {};
            const businessName = ownerInfo.businessName || "Unknown Shop";
            const merchantId = ownerInfo.merchantId || null; // Use `null` if not available

            if (!merchantId) {
              console.error(
                `Merchant ID is missing for shop owner: ${userName}`
              );
            }

            let totalAmountForGroup = items
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2);

            return (
              <div className="group-container" key={userName}>
                <div className="cart-section">
                  <h3>Items from {businessName}:</h3>
                  {items.map((item, index) => (
                    <div
                      key={item.catalogNumber || index}
                      className="cart-item"
                    >
                      <img
                        src={`${API_URL}/uploads/${item.picturePath}`}
                        alt={item.productName}
                        className="cart-item-image"
                      />
                      <div className="cart-item-controls">
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          max={item.amount}
                          onChange={(e) => {
                            const newQuantity = Number(e.target.value);
                            updateCartItemQuantity(
                              item.catalogNumber,
                              newQuantity
                            );
                          }}
                        />
                        <span>${item.price}</span>
                        <button
                          className="remove-button"
                          onClick={() => removeCartItem(item.catalogNumber)}
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-section">
                  <h4>Checkout for {businessName}</h4>
                  <p>
                    Total for {businessName}: ${totalAmountForGroup}
                  </p>

                  {merchantId ? (
                    temp(
                      totalAmountForGroup,
                      paypalEmail,
                      merchantId,
                      items,
                      handlePlaceOrder,
                      order
                    )
                  ) : (
                    // <PayPalCheckoutButton
                    //   totalAmount={totalAmountForGroup}
                    //   paypalEmail={paypalEmail}
                    //   merchantID={merchantId}
                    //   items={items}
                    //   handlePlaceOrder={handlePlaceOrder}
                    //   order={order}
                    // />
                    <p className="error-message">
                      Unable to proceed with checkout: Merchant information is
                      missing.
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  </div>
);

};

export default BasketCart;
