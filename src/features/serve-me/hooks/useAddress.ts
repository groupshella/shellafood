import { useState,useCallback } from "react";
import { BookingAddress } from "../types/serve-me.types";
import { useBooking } from "@/providers";

export default function useAddress()
{
    const{updateBooking,bookingData}=useBooking();
    const [addresses, setAddresses] = useState<BookingAddress[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<BookingAddress | null>(
		bookingData?.address && typeof bookingData.address === 'object' && 'type' in bookingData.address
			? (bookingData.address as BookingAddress)
			: null
	);
    
	const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<BookingAddress | null>(null);
    const handleAddressSelect = useCallback((address: BookingAddress) => {
		setSelectedAddress(address);
		updateBooking({ address });
	}, [updateBooking]);

	const handleAddAddress = useCallback(() => {
		setEditingAddress(null);
		setIsAddressModalOpen(true);
	}, []);

	const handleSaveAddress = useCallback((addressData: Omit<BookingAddress, "id">) => {
		if (editingAddress) {
			setAddresses(addresses.map((a) => (a.id === editingAddress.id ? { ...addressData, id: editingAddress.id } : a)));
		} else {
			const newAddress: BookingAddress = { ...addressData, id: Date.now().toString() };
			setAddresses([...addresses, newAddress]);
		}
		setIsAddressModalOpen(false);
		setEditingAddress(null);
	}, [editingAddress, addresses]);

	const handleCloseAddressModal = useCallback(() => {
		setIsAddressModalOpen(false);
		setEditingAddress(null);
	}, []);
    return {
selectedAddress,isAddressModalOpen,handleAddAddress,handleAddressSelect,handleSaveAddress,handleCloseAddressModal,addresses,editingAddress,setAddresses
    };
}