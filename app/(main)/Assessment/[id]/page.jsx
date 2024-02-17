import EditAssessments from '../../components/Assessments/EditAssessment/EditAssessment';

export default function AssessmentEdit({ params }) {
    // DYNAMIC ROUTE
    const { id } = params;

    return (
        <EditAssessments assessmentsId={id} />
    );
}