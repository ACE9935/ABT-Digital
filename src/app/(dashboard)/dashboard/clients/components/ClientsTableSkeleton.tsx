import { Skeleton } from "@mui/material";

function ClientsTableSkeleton() {
    return ( 
        <div className="flex flex-col gap-5 p-6 w-full">
        <div className="flex flex-col gap-3">
        <Skeleton variant="rounded" height={50} width={"80%"}/>
        <Skeleton variant="rounded" height={30} width={"50%"}/>
        </div>
    <div className="flex flex-col gap-5 grow">
        <Skeleton variant="rounded" height={400} />
    </div>
    </div>
     );
}

export default ClientsTableSkeleton;