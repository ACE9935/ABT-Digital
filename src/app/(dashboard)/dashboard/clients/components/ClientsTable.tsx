import { Client } from "@/types";

interface ClientsTableProps {
    data: Client[];
    startIndex: number;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ data, startIndex }) => {
    const itemsPerPage = 20;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                    <tr className="bg-primary-blue text-white">
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Ordre</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Nom</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Email</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Numéro de Téléphone</th>
                        <th className="py-2 px-4 border-b border-gray-300 text-left">Date de Soumission</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((client, index) => (
                        <tr key={index} className={index % 2 === 0 ? '' : 'bg-blue-700/15'}>
                            <td className="py-2 px-4 border-b border-gray-300">{startIndex + index + 1}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{client.infos.name}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{client.infos.email}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{client.infos.phoneNumber}</td>
                            <td className="py-2 px-4 border-b border-gray-300">{client.infos.submitDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsTable;