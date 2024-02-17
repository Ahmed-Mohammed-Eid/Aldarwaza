/* eslint-disable @next/next/no-img-element */

import React from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {

    const model: AppMenuItem[] = [
        {
            label: 'الرئيسية',
            items: [{ label: 'لوحة التحكم', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'الأقسام',
            items: [
                {label: 'قائمة الأقسام', icon: 'pi pi-fw pi-list', to: '/sections'},
                    {label: 'إضافة قسم', icon: 'pi pi-fw pi-plus', to: '/sections/create'}
            ]
        },
        {
            label: 'الملفات',
            items: [
                {label: 'قائمة الملفات', icon: 'pi pi-fw pi-list', to: '/media'},
                {label: 'إضافة ملف', icon: 'pi pi-fw pi-plus', to: '/media/create'}
            ]
        },
        {
            label: 'المعاينات',
            items: [
                {label: 'قائمة المعاينات', icon: 'pi pi-fw pi-list', to: '/assessment'},
                // {label: 'إضافة زيارة', icon: 'pi pi-fw pi plus', to: '/visits/create'}
            ]
        },
        {
            label: 'الصيانة',
            items: [
                {label: 'قائمة الصيانات', icon: 'pi pi-fw pi-list', to: '/maintenance'},
            ]
        },
        {
            label: 'الإعدادات',
            items: [
                {
                    label: 'تسجيل الخروج', icon: 'pi pi-sign-out', to: '/login', command: () => {
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
