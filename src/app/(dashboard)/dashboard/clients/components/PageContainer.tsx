"use client"

import ClientsTable from "./ClientsTable";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { useUser } from "@/context/authContext";
import ClientsTableSkeleton from "./ClientsTableSkeleton";

function PageContainer() {

    const {user}=useUser()
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const getPaginatedData = () => {
        if (!user) return [];
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return user.clients.slice(startIndex, endIndex);
    };

    const paginatedData = getPaginatedData();

    return (
        <>
            {user?(
                <div className="px-6 py-6">
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold pb-2">Liste des Clients Enregistrés</h1>
                        <p className="text-slate-600 text-lg">
                            Découvrez ici la liste complète des clients enregistrés avec leurs informations détaillées pour une meilleure gestion et un suivi efficace.
                        </p>
                    </div>
                    <ClientsTable data={paginatedData} startIndex={(currentPage - 1) * itemsPerPage} />
                    <div className="pt-6 flex justify-center">
                        <Pagination
                            count={Math.ceil(user.clients.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            ):<ClientsTableSkeleton/>}
        </>
    );
}

export default PageContainer;