import express from 'express'
import cors  from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { ConnectDB } from './config/db.js';
import router from './route/routes.js';
import {app,server} from './socket/index.js'

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.send('Api Working')
})

//Api endpoits
app.use('/api',router)

ConnectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})


