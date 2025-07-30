import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import roomrouter from './routes/roomroutes.js'; 
import userrouter from './routes/userroutes.js';
import loginrouter from './routes/loginroutes.js'
import refreshaccrouter from './routes/authroutes.js';
import logoutrouter from './routes/logoutroutes.js';
import usernameUpdateRoutes from './routes/updateusernameroute.js'; 
import passwordUpdateRoutes from './routes/updatepasswordroute.js';
import roombookingDetails from './routes/roombookingdetailsroute.js'
import checkavailabilty from './routes/roomavailabiltyroute.js'
import newroombooking from './routes/newbookingroute.js'
import thecurrenttrips from './routes/currenttripsroutes.js'
import thepasttrips from './routes/pasttripsroute.js'
import bookingcancel from './routes/cancelbooking.js'
import razorpayroute from './routes/paymentroute.js'
import createhostprofile from './routes/hostcreateroute.js'
import theaddroom from './routes/addroomroute.js'
import thegethostrooms from './routes/hostgetroomsroute.js'
import thegetpaidroooms from './routes/hostgetpaidroomroutes.js'
import theunpaidrooms from './routes/hostgetunconfirmedbookings.js'
import checkinuser from './routes/hostcheckinginuser.js'
import checkoutuser from './routes/hostcheckingoutuser.js'
import paidroute from './routes/addpaidroute.js'
import hostinfo from './routes/hostinforoute.js';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // Serves static files from 'public' directory
app.use(cookieParser());

// Routes middleware
app.use('/api/users', roomrouter);
app.use('/api/users',userrouter);
app.use('/api/users',loginrouter);
app.use('/api/users',logoutrouter);
app.use('/api/auth', refreshaccrouter);
app.use('/api/users', usernameUpdateRoutes);
app.use('/api/users',passwordUpdateRoutes);
app.use('/api/users',roombookingDetails);
app.use('/api/users',checkavailabilty)
app.use('/api/users',newroombooking)
app.use('/api/users',thecurrenttrips)
app.use('/api/users',thepasttrips)
app.use('/api/users',bookingcancel)
app.get('/api/getkey',(req,res)=>{res.status(200).json({key:process.env.RAZORPAY_KEY_ID})})
app.use('/api/users',razorpayroute)
app.use('/api/users',createhostprofile)
app.use('/api/users',theaddroom)
app.use('/api/users',thegethostrooms)
app.use('/api/users',thegetpaidroooms)
app.use('/api/users',theunpaidrooms)
app.use('/api/users',checkinuser)
app.use('/api/users',checkoutuser)
app.use('/api/users', paidroute);
app.use('/api/users', hostinfo)

export { app };
