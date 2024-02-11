'use client';
import React, { useEffect } from 'react';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import Image from 'next/image';


export default function MediaList() {

    //ROUTER
    const router = useRouter();

    //STATE FOR THE MEDIA
    const [media, setMedia] = React.useState([]);
    const [visible, setVisible] = React.useState(false);
    const [mediaIdToDelete, setMediaIdToDelete] = React.useState(null);


    // GET THE MEDIA FROM THE API
    function getMedia() {
        // GET THE TOKEN FROM THE LOCAL STORAGE
        const token = localStorage.getItem('token');

        axios.get(`${process.env.API_URL}/get/all/media`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                // Update the state
                setMedia(res.data?.media || []);
                console.log(res.data);
            })
            .catch(error => {
                toast.error(error?.response?.data?.message || 'An error occurred while getting the media.');
            });
    }

    // EFFECT TO GET THE MEDIA
    useEffect(() => {
        getMedia();
    }, []);

    // DELETE THE PACKAGE HANDLER
    const deleteHandler = async () => {
        //GET THE TOKEN
        const token = localStorage.getItem('token');

        await axios.delete(`${process.env.API_URL}/delete/media`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                mediaId: mediaIdToDelete
            }
        })
            .then(_ => {
                // Show notification
                toast.success('Media Deleted Successfully');
                // Hide the dialog
                setVisible(false);
                // Update the State
                getMedia();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'An error occurred while deleting the media.');
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
                value={media || []}
                style={{ width: '100%' }}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[5, 10, 20]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                emptyMessage="No media found."
            >
                <Column
                    field="mediaPath"
                    header="Image"
                    width="100px"
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center">
                                <Image
                                    src={rowData?.mediaType === 'image' ? rowData?.mediaPath : '/not-found.jpg'}
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
                        );
                    }}
                />

                <Column
                    field="title"
                    header="Title"
                    sortable
                    filter
                />

                <Column
                    field="mediaType"
                    header="Type"
                    sortable
                    filter
                />

                <Column
                    field="mediaPath"
                    header="Media Link"
                    sortable
                    filter
                    // MAKE AN ICON TO OPEN THE URL IN A NEW TAB
                    body={(rowData) => {
                        return (
                                <Image
                                    src="/link.svg"
                                    alt="link"
                                    width={18}
                                    height={18}
                                    className={'ml-4'}
                                    onClick={() => {
                                        window.open(rowData?.mediaPath, '_blank');
                                    }}
                                    style={{
                                        userSelect: 'none',
                                        cursor: 'pointer',
                                        color: '#007bff',
                                    }}
                                />
                        );
                    }}
                />

                <Column
                    field="sectionId"
                    header="Section Id"
                    sortable
                    filter
                    // ADD THE COPY WHEN CLICK TO THE SECTION ID
                    body={(rowData) => {
                        return (
                            <div
                                onClick={() => {
                                    navigator.clipboard.writeText(rowData.sectionId);
                                    toast.success('Section Id Copied');
                                }}
                                style={{
                                    userSelect: 'none',
                                    cursor: 'pointer',
                                    color: '#007bff',
                                }}
                            >
                                {rowData.sectionId}
                            </div>
                        );
                    }}
                />

                <Column
                    field={'_id'}
                    header={'Actions'}
                    style={{ width: '20%' }}
                    body={(rowData) => {
                        return (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="editButton"
                                    onClick={() => {
                                        router.push(`/media/${rowData._id}`);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="deleteButton"
                                    onClick={() => {
                                        setVisible(true);
                                        setMediaIdToDelete(rowData._id);
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        );
                    }}
                />
            </DataTable>
            <Dialog
                header="Delete Media"
                visible={visible}
                position={'top'}
                style={{ width: '90%', maxWidth: '650px' }}
                onHide={() => setVisible(false)}
                footer={footerContent}
                draggable={false}
                resizable={false}>
                <p className="m-0">
                    Are you sure you want to delete this media?
                </p>
            </Dialog>
        </>
    );
}