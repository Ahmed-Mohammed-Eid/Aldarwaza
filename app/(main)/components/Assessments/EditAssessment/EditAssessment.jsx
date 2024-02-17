'use client';
import React, { useState, useEffect } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import {textToTime} from '../../../../../helpers/textToTime';

export default function EditAssessments({ assessmentsId }) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        clientName: '',
        phoneNumber: '',
        governorate: '',
        region: '',
        block: '',
        street: '',
        alley: '',
        building: '',
        floor: '',
        appartment: '',
        visitDate: '',
        visitTime: '',
        description: '',
        files: [],
        agentId: '',
        visitId: ''
    });

    // HANDLERS
    function editAssessments(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (form.clientName === '' || form.phoneNumber === '' || form.governorate === '' || form.region === '' || form.block === '' || form.street === '' || form.alley === '' || form.building === '' || form.floor === '' || form.appartment === '' || form.visitDate === '' || form.visitTime === '' || form.description === '') {
            toast.error('يرجى تعبئة جميع الحقول.');
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);


        // APPEND THE FORM DATA
        formData.append('visitId', assessmentsId);
        formData.append('clientName', form.clientName);
        formData.append('phoneNumber', form.phoneNumber);
        formData.append('governorate', form.governorate);
        formData.append('region', form.region);
        formData.append('block', form.block);
        formData.append('street', form.street);
        formData.append('alley', form.alley);
        formData.append('building', form.building);
        formData.append('floor', form.floor);
        formData.append('appartment', form.appartment);
        formData.append('lat', form.lat);
        formData.append('lng', form.lng);
        formData.append('visitDate', form.visitDate);
        formData.append('visitTime', form.visitTime);
        formData.append('description', form.description);
        formData.append('agentId', '');

        // APPEND THE FILES
        if(form?.files?.length > 0){
            for (let i = 0; i < form.files.length; i++) {
                formData.append('files', form.files[i]);
            }
        }

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/assessment`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || 'تم تعديل المعاينة بنجاح.');
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'حدث خطأ أثناء تعديل المعاينة.');
                setLoading(false);
            });
    }


    // GET THE ASSESSMENTS FROM THE DATABASE
    function getAssessment(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/admin/assessment?visitId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const assessment = res.data?.assessment;
                setForm({
                    clientName: assessment?.clientName,
                    phoneNumber: assessment?.phoneNumber,
                    governorate: assessment?.governorate,
                    region: assessment?.region,
                    block: assessment?.block,
                    street: assessment?.street,
                    alley: assessment?.alley,
                    building: assessment?.building,
                    floor: assessment?.floor,
                    appartment: assessment?.appartment,
                    visitDate: new Date(assessment?.visitDate),
                    visitTime: textToTime(assessment?.visitTime),
                    description: assessment?.description,
                    agentId: assessment?.agentId,
                });
            })
            .catch(err => {
                toast.error(err?.response?.data?.message || 'حدث خطأ أثناء جلب بيانات المعاينة.');
            });
    }

    // EFFECT TO GET THE SECTIONS
    useEffect(() => {
        getAssessment(assessmentsId);
    }, [assessmentsId]);

    return (
        <div className={'card mb-0'} dir={'rtl'}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>تعديل المعاينة </h1>
            <form className="grid formgrid p-fluid" onSubmit={editAssessments}>
                <div className="field col-12">
                    <label htmlFor="assessmentsTitle">اسم العميل</label>
                    <InputText
                        id="assessmentsTitle"
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder={'اسم العميل'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="assessmentsType">رقم العميل</label>
                    <InputText
                        id="assessmentsType"
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        placeholder={'رقم العميل'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">المحافظة</label>
                    <InputText
                        id={'sectionId'}
                        value={form.governorate}
                        onChange={(e) => setForm({ ...form, governorate: e.value })}
                        placeholder={'اختر المحافظة'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">المنطقة</label>
                    <InputText
                        id="sectionId"
                        value={form.region}
                        onChange={(e) => setForm({ ...form, region: e.target.value })}
                        placeholder={'المنطقة'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">القطعة</label>
                    <InputText
                        id="sectionId"
                        value={form.block}
                        onChange={(e) => setForm({ ...form, block: e.target.value })}
                        placeholder={'القطعة'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">الشارع</label>
                    <InputText
                        id="sectionId"
                        value={form.street}
                        onChange={(e) => setForm({ ...form, street: e.target.value })}
                        placeholder={'الشارع'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">الزقاق</label>
                    <InputText
                        id="sectionId"
                        value={form.alley}
                        onChange={(e) => setForm({ ...form, alley: e.target.value })}
                        placeholder={'الزقاق'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">البناء</label>
                    <InputText
                        id="sectionId"
                        value={form.building}
                        onChange={(e) => setForm({ ...form, building: e.target.value })}
                        placeholder={'البناء'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">الطابق</label>
                    <InputText
                        id="sectionId"
                        value={form.floor}
                        onChange={(e) => setForm({ ...form, floor: e.target.value })}
                        placeholder={'الطابق'}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="sectionId">الشقة</label>
                    <InputText
                        id="sectionId"
                        value={form.appartment}
                        onChange={(e) => setForm({ ...form, appartment: e.target.value })}
                        placeholder={'الشقة'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">تاريخ الزيارة</label>
                    <Calendar
                        id="sectionId"
                        value={form.visitDate}
                        onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                        placeholder={'تاريخ الزيارة'}
                        dateFormat={'dd/mm/yy'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">وقت الزيارة</label>
                    <Calendar
                        id="sectionId"
                        value={form.visitTime}
                        onChange={(e) => {
                            setForm({ ...form, visitTime: e.target.value });
                        }}
                        timeOnly
                        hourFormat={'12'}
                        placeholder={'وقت الزيارة'}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="description">الوصف</label>
                    <InputTextarea
                        id="description"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder={'الوصف'}
                    />
                </div>
                <div className="field col-12">
                    <label htmlFor="files">الملفات</label>
                    <CustomFileUpload
                        id={'files'}
                        files={form.files}
                        multiple
                        setFiles={(files) => setForm({ ...form, files: files })}
                    />
                </div>


                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={'submit'}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{
                                                              width: '2rem',
                                                              height: '2rem'
                                                          }} /> : `تعديل المعاينة`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    );
}