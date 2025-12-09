"use client";
import CarMaintenanceDetailsPage from "./CarMaintenanceDetailsPage";
import HomeMaintenanceDetailsPage from "./HomeMaintenanceDetailsPage";

export default function BookingDetailsPage({ service, serviceType }: { service: string; serviceType: string }) {

const SelectDetailsForm=()=>{
    switch(service)
    {
        
        case 'home-maintenance':return <HomeMaintenanceDetailsPage service={service} serviceType={serviceType} />;
        case 'car-maintenance':return <CarMaintenanceDetailsPage service={service} serviceType={serviceType}/>
    }
}
	return (
		<>
    {SelectDetailsForm()}
        </>
	);
}
