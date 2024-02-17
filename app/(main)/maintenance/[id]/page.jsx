import EditMaintenances from '../../components/Maintenance/EditMaintenance/EditMaintenance';

export default function MaintenanceEDIT({ params }) {
    // DYNAMIC ROUTE
    const { id } = params;

    return (
        <>
            <EditMaintenances maintenancesId={id} />
        </>
    );
}