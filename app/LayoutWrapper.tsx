"use client";

import Header from '@/components/Header';
import { usePathname } from 'next/navigation'
import React, { ReactNode } from 'react'

function LayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === "/login";
  return (
    <>
       {!isLogin && <Header/>}

       <main>
        {children}
       </main>
    </>
  )
}

export default LayoutWrapper