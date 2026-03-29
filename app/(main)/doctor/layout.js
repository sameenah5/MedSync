import { PageHeader } from '@/components/ui/page-header';
import { Stethoscope } from 'lucide-react';
import React from 'react'

export const metadata = {
    title: "Doctor  Dashboard - MedSync",
    description: "Manage your appointments and availibility",
}

const DoctorDashboardLayout = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
        <PageHeader icon={<Stethoscope />} title="Doctor Dashboard" />

        {children}
    Welcome
    </div>
    );
};

export default DoctorDashboardLayout