"use client";
import React, {useState} from 'react';
import CustomFileUpload from "../../Layout/customFileUpload/customFileUpload";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import {toast} from "react-hot-toast";
import axios from "axios";

export default function CreateSection() {

    // LOADING STATE
    const [loading, setLoading] = useState(false);

    // STATE
    const [form, setForm] = useState({
        sectionTitle: "",
        files: []
    });

    // HANDLERS
    function createSection(event) {
        // PREVENT THE DEFAULT BEHAVIOUR
        event.preventDefault();

        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        // VALIDATE THE FORM
        if (!form.sectionTitle || !form.files || form.files.length < 1) {
            toast.error("من فضلك املأ جميع الحقول.");
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

        // APPEND THE FILES
        for (let i = 0; i < form.files.length; i++) {
            formData.append("files", form.files[i]);
        }

        // SEND THE REQUEST
        axios.post(`${process.env.API_URL}/create/section`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                toast.success(response.data?.message || "تم إنشاء القسم بنجاح.");
                setLoading(false);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "حدث خطأ ما.");
                setLoading(false);
            })
    }


    return (
        <div className={"card mb-0"} dir={'rtl'}>
            <h1 className={"text-2xl font-bold mb-4 uppercase"}>إضافة قسم</h1>
            <form className="grid formgrid p-fluid" onSubmit={createSection}>
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
                                                          }} /> : `إنشاء القسم`}
                        disabled={loading} />
                </div>
            </form>
        </div>
    )
}