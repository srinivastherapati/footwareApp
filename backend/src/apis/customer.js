
import express from 'express';
import Customer from '../modal/CustomerModal.js';
import Orders from '../modal/Orders.js';

const customerRouter=express.Router();

customerRouter.get('/customer/get', async (req, res) => {

    try {

         const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const skip = (page - 1) * limit;
        
                // Fetch total customer count for pagination
                const totalCustomers = await Customer.countDocuments();
        const customers = await Customer.find({ firstName: { $ne: 'admin' } });

        if (!customers.length) {
            return res.status(404).json([]);
        }

        const customerDetails = await Promise.all(customers.map(async (customer) => {
            const customerOrders = await Orders.find({ customerId: customer._id });

            const totalOrderValue = customerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
            const lastOrderDate = customerOrders.length ? customerOrders.sort((a, b) => b.orderDate - a.orderDate)[0].orderDate : null;

            return {
                customerName: customer.firstName,
                customerEmail: customer.email,
                numberOfOrders: customerOrders.length,
                customerTotalOrderValue: totalOrderValue,
                lastOrderDate
            };
        }));

        return res.status(200).json({
            currentPage: page,
            totalCustomers,
            totalPages: Math.ceil(totalCustomers / limit),
            customers: customerDetails
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default customerRouter;

