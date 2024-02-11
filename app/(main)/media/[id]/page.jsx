import EditMedia from '../../components/Media/EditMedia/EditMedia';



export default async function EditMediaPage({params}) {
    // DYNAMIC ROUTE
    const { id } = params

    return (
        <EditMedia mediaId={id} />
    );
}