"use client"
import { QRCode } from "@/types";
import { useAppSelector } from "../../qr-code-state/hooks";
import { useEffect } from "react";
import { useUser } from "@/context/authContext";
import { Skeleton } from "@mui/material";

function QrcodeDisplay() {
    
    const qrCode:QRCode=useAppSelector(state=>state.qrCode)
    const {user}=useUser()

    useEffect(()=>{
        var QRCode = require('qrcode')
        var canvas = document.getElementById('qr-code-display')
        
        if(user) QRCode.toCanvas(canvas, qrCode.text,{
            margin:qrCode.margin,
            errorCorrectionLevel:qrCode.correctionLevel,
            
            scale:8,
            color:{
                dark:qrCode.darkColor,
                light:qrCode.lightColor
            }
        }, function (error:any) {
          if (error) console.error(error)
          
        })
    },[qrCode,user])

    return ( 
        <>{user?<div className="flex flex-col gap-2">
            <div className="bg-primary-blue text-white p-3 rounded-t-xl font-bold text-center">Aperçu du code QR</div>
        <canvas id="qr-code-display" className="">
            
        </canvas>
 
        </div>:<Skeleton variant="rounded" height={300} width={300} />}</>
     );
}

export default QrcodeDisplay;