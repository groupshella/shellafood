"use client";
import BabySittingDetailsForm from "../Forms/BabySittingDetailsForm";
import CarMaintenanceDetailsForm from "../Forms/CarMaintenanceDetailsForm";
import HomeMaintenanceDetailsForm from "../Forms/HomeMaintenanceDetailsForm";
import MenSalonServicesDetailsForm from "../Forms/MenSalonServicesDetailsForm";
import WomenSalonServicesDetailsForm from "../Forms/WomenSalonServicesDetailsForm";
export default function BookingDetailsPage({ service, serviceType }: { service: string; serviceType: string }) {
const SelectDetailsForm=()=>{
    switch(service)
    { 
        case 'home-maintenance':return <HomeMaintenanceDetailsForm service={service} serviceType={serviceType} />
        case 'car-maintenance':return <CarMaintenanceDetailsForm service={service} serviceType={serviceType}/>
        case 'women-salons':return <WomenSalonServicesDetailsForm service={service} serviceType={serviceType} />
        case 'men-salons':return <MenSalonServicesDetailsForm service={service} serviceType={serviceType} />
    case 'babysitting':return <BabySittingDetailsForm service={service} serviceType={serviceType}/>
    }
}
	return (
		<>
    {SelectDetailsForm()}
        </>
	);
}
