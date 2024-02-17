'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function AssessmentsList() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE ASSESSMENTS
    const [assessments, setAssessments] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [assessmentsIdToDelete, setAssessmentsIdToDelete] = React.useState(null);
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [selectedAssessment, setSelectedAssessment] = React.useState(null);


    // GET THE ASSESSMENTS FROM THE API
    function getAssessments() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/admin/assessments`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // Update the state
                setAssessments(res.data?.visits || []);
                console.log(res.data);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'حدث خطأ ما أثناء جلب البيانات.');
            });
    }

    // EFFECT TO GET THE ASSESSMENTS
    useEffect(() => {
        getAssessments();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.delete(`${process.env.API_URL}/delete/assessments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                assessmentsId: assessmentsIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('تم حذف البيانات بنجاح.');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getAssessments();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'حدث خطأ ما أثناء حذف البيانات.');
            });
    };

    const footerContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text" />
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
                style={{
                    backgroundColor: '#dc3545',
                    color: '#fff'
                }}
                autoFocus />
        </div>
    );

    return (
        <>
            <DataTable
                value={assessments || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No assessments found."
            >

                <Column
                    field="clientName"
                    header="اسم العميل"
                    sortable
                    filter
                />
                <Column
                    field="phoneNumber"
                    header="رقم العميل"
                    sortable
                    filter
                />

                <Column
                    field={"governorate"}
                    header={"المحافظة"}
                    sortable
                    filter
                />

                <Column
                    field={'region'}
                    header={'المنطقة'}
                    sortable
                    filter
                />

                <Column
                    field={'block'}
                    header={'القطعة'}
                    sortable
                    filter
                />

                <Column
                    field={'_id'}
                    header={'الإجراءات'}
                    style={{ width: '20%' }}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="viewButton"
                                    onClick={() => {
                                        setSelectedItem(rowData);
                                    }}
                                >
                                    عرض
                                </button>
                                <button
                                    disabled={rowData?.isVisited}
                                    className="action1"
                                    onClick={() => {
                                        setSelectedAssessment(rowData);
                                    }}
                                >
                                    {rowData?.isVisited ? 'تمت الزيارة' : 'إتمام الزيارة'}
                                </button>
                                <button
                                    disabled={rowData?.isVisited}
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/assessment/${rowData._id}`);
                                    }}
                                >
                                    تعديل
                                </button>
                                {/*<button*/}
                                {/*    className="deleteButton"*/}
                                {/*    onClick={() => {*/}
                                {/*        setVisible(true);*/}
                                {/*        setAssessmentsIdToDelete(rowData._id);*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    حذف*/}
                                {/*</button>*/}
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Assessments"
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    هل أنت متأكد من حذف البيانات؟
                </p>
            </Dialog>
            <Dialog onHide={() => setSelectedItem(null)} visible={!!selectedItem} header="تفاصيل الزيارة" style={{ width: '50vw' }}>
                <div className={'grid'} dir={'rtl'}>
                    <div className={'col-12 md:col-6'}>
                        <h5>اسم العميل</h5>
                        <p>{selectedItem?.clientName}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>رقم العميل</h5>
                        <p>{selectedItem?.phoneNumber}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>المحافظة</h5>
                        <p>{selectedItem?.governorate}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>المنطقة</h5>
                        <p>{selectedItem?.region}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>القطعة</h5>
                        <p>{selectedItem?.block}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>الشارع</h5>
                        <p>{selectedItem?.street}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>الزقاق</h5>
                        <p>{selectedItem?.alley}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>البناء</h5>
                        <p>{selectedItem?.building}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>الطابق</h5>
                        <p>{selectedItem?.floor}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>الشقة</h5>
                        <p>{selectedItem?.appartment}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>تاريخ الزيارة</h5>
                        <p>{new Date(selectedItem?.visitDate).toLocaleDateString('ar-EG', { year: 'numeric', month: 'numeric', day: 'numeric' })}</p>
                    </div>
                    <div className={'col-12 md:col-6'}>
                        <h5>وقت الزيارة</h5>
                        <p>{selectedItem?.visitTime}</p>
                    </div>
                    <div className={'col-12'}>
                        <h5>الوصف</h5>
                        <p>{selectedItem?.description}</p>
                    </div>
                </div>
            </Dialog>
            <Dialog
                onHide={() => setSelectedAssessment(null)}
                visible={!!selectedAssessment}
                header="تغيير الحالة"
                style={{ width: '50vw', direction: 'rtl'}}
                footer={() => {
                    return (
                        <div className={'flex justify-between'} dir={'ltr'}>
                            <Button
                                label="تأكيد"
                                onClick={() => {
                                    axios.put(`${process.env.API_URL}/update/visit/status`, {
                                        visitId: selectedAssessment?._id,
                                        isVisited: true,
                                    }, {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`
                                        }
                                    })
                                        .then(res => {
                                            toast.success('تم تغيير حالة المعاينة بنجاح.');
                                            setSelectedAssessment(null);
                                            getAssessments();
                                        })
                                        .catch(err => {
                                            toast.error(err?.response?.data?.message || 'حدث خطأ ما أثناء تغيير حالة المعاينة.');
                                        });
                                }}
                                className={'p-button-success'}
                            />
                            <Button
                                label="الغاء"
                                onClick={() => {
                                    setSelectedAssessment(null);
                                }}
                                className={'p-button-danger'}
                            />
                        </div>
                    );
                }}
            >
                <p>هل أنت متأكد من أنك تريد تغيير حالة هذه المعاينة</p>
            </Dialog>
        </>
    );
}