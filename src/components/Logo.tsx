import { configurations } from "@/app-configurations";

function Logo() {
    return ( 
        <div className="text-white font-bold text-2xl">{configurations.appName}</div>
     );
}

export default Logo;