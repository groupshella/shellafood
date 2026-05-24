import { div } from "framer-motion/client";
import CarBookingDetailsPage from "./CarBookingDetailspage";
import SalonBookingDetailsPage from "./SalonBookingDetails";
import HomeBookingDetailsPage from "./HomeBookingDetailsPage";
import AdvBookingDetailsPage from "./AdvBookingDetailsPage";
import TransportBookingDetailsPage from "./TransportBookingDetailsPage";

export default function BookingDetailsPage({ serviceId, title }: { serviceId: string, title: string }) {
  switch (serviceId) {
    case "1": { return <CarBookingDetailsPage serviceId={serviceId} /> }
    case "2": { return <HomeBookingDetailsPage serviceId={serviceId} /> }
    case "3": { return <AdvBookingDetailsPage serviceId={serviceId} /> }
    case "4": { return <SalonBookingDetailsPage serviceId={serviceId} /> }
  }
}