"use client";
import React, {useState, useEffect} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function EditSection({sectionId }) {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        sectionTitle: "",
        files: []
    });

    function getSection(id) {
        // GET THE TOKEN FROM THE COOKIES
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/section?sectionId=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => {
                const section = res.data.section;
                setForm({
                    sectionTitle: section.title,
                    files: []
                })
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the section.');
            })
    }

    // EFFECT TO SET THE FORM VALUES
    useEffect(() => {
        getSection(sectionId);
    }, [sectionId]);

    // HANDLERS
    function editSection(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.sectionTitle) {
            toast.error("من فضاك أدخل عنوان القسم.");
            return;
        }

        // SET THE LOADING TO TRUE
        setLoading(true);

        // CREATE THE FORM DATA
        const formData = new FormData();

        // Set the loading state for the spinner
        setLoading(true);


        // APPEND THE TITLE
        formData.append("sectionTitle", form.sectionTitle);
        formData.append("sectionId", sectionId);

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.put(`${process.env.API_URL}/edit/section`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "تم تعديل القسم بنجاح.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "حدث خطأ ما.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"} dir={'rtl'}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>تعديل القسم</h1>
            <form className="grid formgrid p-fluid" onSubmit={editSection}>
                <div className="field col-12">
                    <label htmlFor="sectionTitle">اسم القسم</label>
                    <InputText
                        id="sectionTitle"
                        type="text"
                        placeholder={"اسم القسم"}
                        value={form.sectionTitle}
                        onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
                    />
                </div>
                <div className="col-12 mb-2 lg:mb-2" dir={'ltr'}>
                    <label className={"mb-2 block"} htmlFor="male-image" dir={'rtl'}>صورة القسم</label>
                    <CustomFileUpload
                        setFiles={(files) => {
                            setForm({ ...form, files })
                        }}
                        removeThisItem={(index) => {
                            // ITEMS COPY
                            const items = [...form?.files || []]
                            // FILTER THE ITEMS
                            const newItems = items.filter((item, i) => {
                                return i !== index
                            })
                            // SET THE STATE
                            setForm({ ...form, files: newItems })
                        }}
                    />
                </div>
                <div className="field col-12 md:col-6 mt-4 ml-auto">
                    <Button
                        type={"submit"}
                        label={loading ? <ProgressSpinner fill={'#fff'} strokeWidth={'4'}
                                                          style={{
                                                              width: '2rem',
                                                              height: '2rem'
                                                          }} /> : `تعديل القسم`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}