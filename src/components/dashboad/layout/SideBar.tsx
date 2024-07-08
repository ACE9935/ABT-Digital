
import Logo from "@/components/Logo";
import SideBarLink from "./SideBarLink";
import UserTab from "./UserTab";
import { Home, NotificationAddOutlined, People, QrCode } from "@mui/icons-material";

const links=[
  {
    title:"Acceuil",
    url:"/dashboard",
    icon:Home
   },
  {
  title:"Qr Codes",
  url:"/dashboard/qrcodes",
  icon:QrCode
 },
   {
    title:"Clients",
    url:"/dashboard/clients",
    icon:People
   },
   {
    title:"Automatisation",
    url:"/dashboard/send-requests",
    icon:NotificationAddOutlined
   }
   ,
]

function SideBar() {
    return ( 
      <nav className="relative">
       <div className="bg-primary-color w-[17rem] sticky top-0 min-h-screen flex flex-col justify-between">
        <div className='flex flex-col gap-8 py-8'>
        <div className='flex pl-10'><Logo/></div>
        <div className="flex flex-col pl-2 pr-4 gap-2">{links.map((o,i)=><SideBarLink key={i} selected={false} {...o}/>)}</div>
        
        </div>
        <div><UserTab/></div>
      </div>
      
      </nav>
     );
}

export default SideBar;