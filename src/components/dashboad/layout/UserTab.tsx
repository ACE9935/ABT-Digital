"use client"

import { useUser } from "@/context/authContext";
import { auth } from "@/firebase/firebase";
import { Skeleton } from "@mui/material";
import { signOut } from "firebase/auth";

function UserTabSkeleton() {
    return ( 
        <div className="flex flex-col gap-3 items-center pb-4 w-full">
        <Skeleton variant="rounded" height={30} width={100} sx={{background:"rgba(255,255,255,0.8)"}}/>
        <Skeleton variant="rounded" height={40} width={180} sx={{background:"rgba(255,255,255,0.8)"}}/>
        </div>
     );
}


function UserTab() {

    const {user}=useUser()
    
    return ( 
        <>{user? <div className="flex flex-col gap-3 items-center pb-4">
            <div className="flex gap-3 items-center">
            <img src={user.photoUrl} className="w-[40px] rounded-full"/>
            <div className="text-white font-bold">{user.name}</div>
            </div>
            <button onClick={()=>signOut(auth)} className="text-white font-bold p-3 rounded-md bg-primary-blue">Se déconnecter</button>
            </div>: <UserTabSkeleton/>}</>
     );
}

export default UserTab;