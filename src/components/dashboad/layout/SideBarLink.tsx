
import { SvgIconComponent } from "@mui/icons-material";
import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type SideBarIconType =OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
} 

interface SideBarItemProps {
    url:string
    title:string
    icon:SideBarIconType
    selected:boolean
}

function SideBarLink({ url, title, selected,...props }: SideBarItemProps) {
    
    return ( 
        <div className={`py-3 text-white font-semibold hover:bg-black/40 rounded-xl w-full flex gap-3 cursor-pointer hover:text-primary-blue transition-all w-fit`}>
        <div className={`w-1 mr-4 ${selected?"bg-primary-blue":""}`}></div>
        <div className={`p-[0.4rem] ${selected?"border-[0.1rem] border-title-secondary rounded-full":""}`}><props.icon className={selected?"text-primary-blue":""}/></div>
        <span className="flex items-center">{title}</span>
      </div>
     );
}

export default SideBarLink;