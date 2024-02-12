'use client';
import React, { useState } from 'react';
import CustomFileUpload from '../../Layout/customFileUpload/customFileUpload';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function CreateMedia() {

    // LOADING STATE
    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState([]);

    // STATE
    const [form, setForm] = useState({
        mediaTitle: '',
        mediaType: '',
        files: [],
        sectionId: ''
    });

    // HANDLERS
    function createMedia(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        // VALIDATE THE FORM
        if (!form.mediaTitle || !form.files || form.files.length < 1) {
            toast.error('من فضلك قم بتعبئة جميع الحقول.');
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);

        // APPEND THE TITLE
        formData.append('title', form.mediaTitle);
        formData.append('sectionId', form.sectionId);
        formData.append('mediaType', form.mediaType);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append('files', form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/upload/media`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || 'تم إضافة الملف بنجاح.');
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'حدث خطأ أثناء إضافة الملف.');
                setLoading(false);
            });
    }

    // GET SECTIONS HANDLER
    function getSections() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/sections`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                // LOOP THROUGH THE SECTIONS AND CREATE A NEW ARRAY WITH THE LABEL FROM TITLE AND THE VALUE FROM _ID
                const sectionsList = response.data?.sections?.map((section) => {
                    return {
                        label: section.title,
                        value: section._id
                    };
                });
                setSections(sectionsList || []);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'حدث خطأ أثناء جلب الأقسام.');
            });
    }

    // EFFECT TO GET THE SECTIONS
    React.useEffect(() => {
        getSections();
    }, []);


    return (
        <div className={'card mb-0'} dir={'rtl'}>
            <h1 className={'text-2xl font-bold mb-4 uppercase'}>إضافة ملف</h1>
            <form className="grid formgrid p-fluid" onSubmit={createMedia}>
                <div className="field col-12">
                    <label htmlFor="mediaTitle">اسم الملف</label>
                    <InputText
                        id="mediaTitle"
                        type="text"
                        placeholder={'اسم الملف'}
                        autoComplete={'off'}
                        value={form.mediaTitle}
                        onChange={(e) => setForm({ ...form, mediaTitle: e.target.value })}
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="mediaType">نوع الملف</label>
                    <Dropdown
                        id="mediaType"
                        placeholder={'اختر نوع الملف'}
                        value={form.mediaType}
                        onChange={(e) => setForm({ ...form, mediaType: e.target.value })}
                        options={[{ label: 'فيديو', value: 'video' }, {
                            label: 'صورة',
                            value: 'image'
                        }, { label: 'ملف', value: 'document' }]}
                    />
                </div>

                <div className="field col-12 md:col-6">
                    <label htmlFor="sectionId">القسم</label>
                    <Dropdown
                        id="sectionId"
                        placeholder={'اختر القسم'}
                        value={form.sectionId}
                        onChange={(e) => setForm({ ...form, sectionId: e.target.value })}
                        options={sections || []}
                    />
                </div>

                <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                    <label className={'mb-2 block'} htmlFor="male-image" dir={'rtl'}>الملف</label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setForm({ ...form, files });
                        }}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...form?.files || []];
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index;
                            });
                            // SET THE STATE
                            setForm({ ...form, files: newItems });
                        }}
                    />
                </div>
                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={'submit'}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{
                                                              width: '2rem',
                                                              height: '2rem'
                                                          }} /> : `إنشاء الملف`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    );
}