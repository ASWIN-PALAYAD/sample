const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Booking = require('../models/bookingsModel')
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Bus = require('../models/busModel')
const { v4: uuidv4 } = require('uuid');

//book a seat 
router.post('/book-seat',authMiddleware, async(req,res)=> {
    try {
        const newBooking = new Booking({
            ...req.body,
            user : req.body.userId
        })
        console.log(newBooking);
        await newBooking.save();

        const bus = await Bus.findById(req.body.bus);
        bus.seatsBooked = [...bus.seatsBooked,...req.body.seats];
        await bus.save()
        res.status(200).send({
            success: true,
            message: 'Booking successful',
            data:newBooking
        })
    } catch (error) {
        res.status(500).send({
            message:"Booking failed",
            data:error,
            success : false,
        })
    }
});

//make payment 
router.post('/make-payment',authMiddleware,async(req,res)=> {
    try {
        const {token,amount} = req.body;
        const customer = await stripe.customers.create({
            email:token.email,
            source:token.id
        })
        const payment = await stripe.paymentIntents.create({  //charges
            amount:amount,
            currency:'inr',
            customer:customer.id,
            receipt_email:token.email
        },{
            idempotencyKey:uuidv4()
        })
        if(payment){
            res.status(200).send({
                message:"Payment successfull",
                data:{
                    transactionId:payment.id
                },
                success:true
            })
        }else{
            res.status(500).send({
                message:'Payment failed',
                data:error,
                success:false
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Payment failed', 
            data:error,
            success:false
        })
    }
})

//get booking by user id
router.get('/get-bookings-by-user-id', authMiddleware, async(req,res)=> {
    try {
        const bookings = await Booking.find({user:req.body.userId}).populate('bus').populate('user');
        res.status(200).send({
            message:"Bookings fetched successfully",
            data:bookings,
            success:true
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message:'Booking fetch failed', 
            data:error,
            success:false
        })
    }
})

module.exports = router;