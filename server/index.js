import express from 'express'
import cors  from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import { ConnectDB } from './config/db.js';
import router from './route/routes.js';
import {app,server} from './socket/index.js'
import path from 'path'

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());
const __dirname = path.resolve();
const PORT = process.env.PORT || 4000;

app.get('/',(req,res)=>{
    res.send('Api Working')
})

//Api endpoits
app.use('/api',router)
app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


ConnectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
})


