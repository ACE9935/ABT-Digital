import SideBar from "./SideBar";

function DashBoardLayout({children}:{children:React.ReactNode}) {
    return ( 
        <div className="flex">
            <SideBar/>
            <main className="grow bg-slate-200">{children}</main>
        </div>
     );
}

export default DashBoardLayout;