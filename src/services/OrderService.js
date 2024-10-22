const Order = require("../models/OrderModel")
const Product = require("../models/ProductModel")

const createOrder = async (newOrder) => {
    const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user } = newOrder;

    try {
        const results = await Promise.all(orderItems.map(async (order) => {
            const productData = await Product.findOneAndUpdate(
                {
                    _id: order.product,
                    countInStock: { $gte: order.amount }
                },
                {
                    $inc: {
                        countInStock: -order.amount,
                        selled: +order.amount
                    }
                },
                { new: true }
            );

            if (productData) {
                return { status: "OK", message: "SUCCESS" };
            } else {
                return { status: "ERR", id: order.product };
            }
        }));

        const outOfStockProducts = results.filter(item => item.status === "ERR").map(item => item.id);

        // Nếu có sản phẩm hết hàng, trả về thông báo lỗi
        if (outOfStockProducts.length > 0) {
            return {
                status: "ERR",
                message: `Sản phẩm với ID ${outOfStockProducts.join(', ')} không đủ hàng`,
            };
        }

        // Tạo đơn hàng nếu tất cả sản phẩm đều có đủ hàng
        const createdOrder = await Order.create({
            orderItems,
            shippingAddress: {
                fullName,
                address,
                city,
                phone
            },
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user,
        });

        return {
            status: "OK",
            message: "Đặt hàng thành công",
            order: createdOrder
        };

    } catch (e) {
        throw new Error("Có lỗi xảy ra khi tạo đơn hàng");
    }
}


const getALLOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: "ERR",
                    message: "The order is not define"
                })
            }
            resolve({
                status: "OK",
                message: "Success",
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}
const getDetailsOrder = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: "ERR",
                    message: "The order is not define"
                })
            }
            resolve({
                status: "OK",
                message: "Success",
                data: order
            })

        } catch (e) {
            reject(e)
        }
    })
}
const cancelDetailsOrder = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order;
            for (let orderItem of data) {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: orderItem.product,
                        selled: { $gte: orderItem.amount },
                    },
                    {
                        $inc: {
                            countInStock: +orderItem.amount,
                            selled: -orderItem.amount,
                        },
                    },
                    { new: true }
                );

                if (!productData) {
                    return resolve({
                        status: "ERR",
                        message: `Sản phẩm với id ${orderItem.product} không tồn tại hoặc không đủ số lượng.`,
                    });
                }
            }

            // Xóa đơn hàng sau khi tất cả sản phẩm được cập nhật thành công
            order = await Order.findByIdAndDelete(id);
            if (!order) {
                return resolve({
                    status: "ERR",
                    message: "Đơn hàng không tồn tại",
                });
            }

            resolve({
                status: "OK",
                message: "Đơn hàng đã được hủy thành công",
                data: order,
            });
        } catch (e) {
            reject(e);
        }
    });
};


module.exports = {
    createOrder,
    getALLOrderDetails,
    getDetailsOrder,
    cancelDetailsOrder

}