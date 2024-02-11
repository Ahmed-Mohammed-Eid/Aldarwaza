// COMPONENTS
import EditSection from '../../components/Sections/EditSection/EditSection';


export default async function EditSectionPage({params}) {
    // DYNAMIC ROUTE
    const { id } = params

    return (
        <EditSection sectionId={id} />
    );
}