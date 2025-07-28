const paypal = require("../../helper/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product =require("../../models/Product")

const createOrder = async (req, res) => {
    try {
        const {
            userId,
            cartItems,
            addressInfo,
            orderStatus,
            paymentMethod,
            paymentStatus,
            totalAmount,
            orderDate,
            orderUpdateDate,
            paymentId,
            payerId,
            cartId
        } = req.body;

        // Calculate total from cartItems to match with totalAmount
        const calculatedTotal = cartItems.reduce((acc, item) => {
            return acc + item.price * item.quantity;
        }, 0).toFixed(2);

        const finalTotal = Math.max(0, parseFloat(totalAmount)).toFixed(2);

        // ⚠️ Check mismatch
        if (calculatedTotal !== finalTotal) {
            return res.status(400).json({
                success: false,
                message: `Mismatch in cart total (${calculatedTotal}) and totalAmount (${finalTotal})`
            });
        }

        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: 'http://localhost:5173/shop/paypal-return',
                cancel_url: 'http://localhost:5173/shop/paypal-cancel'
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: Number(item.price).toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total: finalTotal
                    },
                    description: 'Order payment with optional discount'
                }
            ]
        };

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.error("PayPal error:", error.response || error);
                return res.status(500).json({
                    success: false,
                    message: 'Error while creating PayPal payment',
                    error: error.response || error
                });
            }

            try {
                const newlyCreateOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount: finalTotal,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                });

                await newlyCreateOrder.save();

                const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;

                res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreateOrder._id
                });
            } catch (err) {
                console.error("Order saving error:", err);
                res.status(500).json({
                    success: false,
                    message: 'Error while saving order to database'
                });
            }
        });

    } catch (e) {
        console.error("Unexpected error:", e);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};



const capturePayment = async (req, res) => {
    try {
        const { paymentId, payerId, orderId } = req.body;

        let order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order cannot be found'
            });
        }

        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentId = paymentId;
        order.payerId = payerId;

        for(let item of order.cartItems){
            let product = await Product.findById(item.productId)
            if(!product){
                return res.status(404).json({
                    success:false,
                    message:`Not enough stock for this product ${product.title}`
                })
            }

            product.totalStock -= item.quantity
            await product.save()
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId);

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order confirmed",
            data: order
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getAllOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId });

        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found!'
            });
        }

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

module.exports = {
    createOrder,
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
};
