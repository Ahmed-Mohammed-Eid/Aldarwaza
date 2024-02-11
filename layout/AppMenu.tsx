/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Sections',
            items: [
                {label: 'Sections List', icon: 'pi pi-fw pi-list', to: '/sections'},
                    {label: 'Add Section', icon: 'pi pi-fw pi-plus', to: '/sections/create'}
            ]
        },
        {
            label: 'Media',
            items: [
                {label: 'Media List', icon: 'pi pi-fw pi-list', to: '/media'},
                {label: 'Add Media', icon: 'pi pi-fw pi-plus', to: '/media/create'}
            ]
        },
        {
            label: 'Settings',
            items: [
                {
                    label: 'LogOut', icon: 'pi pi-sign-out', to: '/login', command: () => {
                        // Clear local storage
                        localStorage.clear();
                        // Clear Cookies
                        document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                                .replace(/^ +/, "")
                                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                        });
                        // Redirect to login page
                        window.location.href = '/login';
                    },
                },
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
