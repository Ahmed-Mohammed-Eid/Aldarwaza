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


export default function SectionsList() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE SECTIONS
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

            })
            .catch(error => {
                toast.error(error?.response?.data?.message || "An error occurred while getting the sections.");
            })
    }

    // EFFECT TO GET THE SECTIONS
    useEffect(() => {
        getSections();
    }, []);

    const sections = [
        {
            _id: 1,
            sectionTitle: "Media 1",
            files: [
                'https://via.placeholder.com/150',
                'https://via.placeholder.com/150',
                'https://via.placeholder.com/150'
            ]
        }
    ]

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
                    field="sectionTitle"
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
                    <div className="field col-12">
                        <h4>Section Title</h4>
                        <p>{selectedSection?.sectionTitle}</p>
                    </div>
                    <div className="field col-12">
                        <h4>Files</h4>
                        <div className="flex flex-row flex-wrap gap-2">
                            {selectedSection?.files.map((file, index) => {
                                return (
                                    <Image
                                        width={100}
                                        height={100}
                                        key={index}
                                        src={file}
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