"use client";
import React, {useEffect} from "react";

import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import axios from "axios";
import {toast} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Image from 'next/image';
import isValidURL from '../../../../../helpers/isUrlValid';


export default function SectionsList() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE SECTIONS
    const [sections, setSections] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [detailsVisible, setDetailsVisible] = React.useState(false);
    const [sectionIdToDelete, setSectionIdToDelete] = React.useState(null);
    const [selectedSection, setSelectedSection] = React.useState(null);


    // GET THE SECTIONS FROM THE API
    function getSections() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem("token");

        axios.get(`${process.env.API_URL}/sections`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
            .then(res => {
                // Update the state
                setSections(res.data?.sections || []);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the sections.");
            })
    }

    // EFFECT TO GET THE SECTIONS
    useEffect(() => {
        getSections();
    }, []);


    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem("token");

        await axios.delete(`${process.env.API_URL}/delete/section`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                sectionId: sectionIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Media Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getSections();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || "An error occurred while deleting the section.");
            })
    }

    const footerContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setVisible(false)}
                className="p-button-text"/>
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    deleteHandler();
                }}
                style={{
                    backgroundColor: "#dc3545",
                    color: "#fff"
                }}
                autoFocus/>
        </div>
    );

    return (
        <>
            <DataTable
                value={sections || []}
                style={{width: '100%'}}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No sections found."
            >
                <Column
                    field="image"
                    header="Image"
                    width="100px"
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center">
                                <Image
                                    src={rowData?.image || '/not-found.jpg'}
                                    alt={rowData?.title}
                                    width={50}
                                    height={50}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        cursor: 'pointer',
                                        border: '1px solid #ccc'
                                    }}
                                />
                            </div>
                        )
                    }}
                />

                <Column
                    field="title"
                    header="Title"
                    sortable
                    filter
                    style={{width: '70%'}}
                />

                <Column
                    field={'_id'}
                    header={'Actions'}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="copyButton"
                                    onClick={() => {
                                        setDetailsVisible(true);
                                        setSelectedSection(rowData);
                                    }}
                                >
                                    View Details
                                </button>
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/sections/${rowData._id}`)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setSectionIdToDelete(rowData._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Section"
                visible={visible}
                position={"top"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this section?
                </p>
            </Dialog>

            <Dialog
                header="DETAILS"
                visible={detailsVisible}
                position={"center"}
                style={{width: '90%', maxWidth: '650px'}}
                onHide={() => setDetailsVisible(false)}
                draggable={false}
                resizable={false}
            >
                <div className={'flex flex-column'}>
                    <div className="field col-12 relative">
                        <h4>Section Image</h4>
                        <Image
                            src={selectedSection?.image || '/not-found.jpg'}
                            alt={selectedSection?.title}
                            width={600}
                            height={300}
                            style={{width: '100%', objectFit: 'contain'}}
                        />
                    </div>
                    <div className="field col-12 relative">
                        <h4>Section Title</h4>
                        <p>{selectedSection?.title}</p>
                    </div>
                    <div className="field col-12">
                        <h4>Files</h4>
                        <div className="flex flex-row flex-wrap gap-2">
                            {selectedSection?.sectionMedia?.map((file, index) => {
                                return (
                                    <Image
                                        width={100}
                                        height={100}
                                        key={index}
                                        src={isValidURL(file) ? file : '/not-found.jpg'}
                                        alt={file}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Dialog>

        </>
    )
}