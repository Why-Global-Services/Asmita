import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { EnquiryProvider } from './hooks/useEnquiry';
export default function App(){return <EnquiryProvider><AppRoutes/></EnquiryProvider>}
