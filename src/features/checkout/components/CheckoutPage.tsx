'use client';

import { useCheckout } from '../hooks/useCheckout';
import { AddressStep } from './AddressStep';
import { PaymentStep } from './PaymentStep';
import { ConfirmStep } from './CheckoutSteps';
import { SuccessStep } from './CheckoutSteps'
import { CheckoutHeader } from './CheckoutHeader';
import { CheckoutSummary } from './CheckoutSteps';

interface CheckoutPageProps {
	storeId: number;
	orderAmount: number;
	distance: number;
	storeName: string;
	itemCount: number;
}

export function CheckoutPage({
	storeId,
	orderAmount,
	distance,
	storeName,
	itemCount,
}: CheckoutPageProps) {
	const checkout = useCheckout(storeId, orderAmount, distance);
	const { state } = checkout;

	const STEPS = ['address', 'payment', 'confirm'] as const;
	const currentStepIndex = STEPS.indexOf(state.step as any);

	if (state.step === 'success') {
		return <SuccessStep orderId={state.placedOrderId!} />;
	}

	return (
		<div className="min-h-screen bg-[#f5f5f0]" dir="rtl">
			{/* Header */}
			<CheckoutHeader
				step={state.step}
				stepIndex={currentStepIndex}
				totalSteps={STEPS.length}
				onBack={checkout.goBack}
			/>

			<div className="max-w-2xl mx-auto px-4 pb-32 pt-6">
				{/* Error Banner */}
				{state.error && (
					<div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
						{state.error}
					</div>
				)}

				{/* Step Content */}
				<div className="space-y-4">
					{state.step === 'address' && (
						<AddressStep
							orderType={state.orderType}
							address={state.address}
							onOrderTypeChange={checkout.setOrderType}
							onAddressChange={checkout.setAddress}
							isLoading={state.isLoading}
							onNext={checkout.goToPayment}
						/>
					)}

					{state.step === 'payment' && (
						<PaymentStep
							paymentMethod={state.paymentMethod}
							deliveryInfo={state.deliveryInfo}
							orderAmount={orderAmount}
							dmTips={state.dmTips}
							orderNote={state.orderNote}
							couponCode={state.couponCode}
							onPaymentMethodChange={checkout.setPaymentMethod}
							onDmTipsChange={checkout.setDmTips}
							onOrderNoteChange={checkout.setOrderNote}
							onCouponChange={checkout.setCouponCode}
							onNext={checkout.goToConfirm}
						/>
					)}

					{state.step === 'confirm' && (
						<ConfirmStep
							state={state}
							orderAmount={orderAmount}
							storeName={storeName}
							itemCount={itemCount}
							isLoading={state.isLoading}
							onPlaceOrder={async () => {
								await checkout.placeOrder();
								await checkout.processPayment();
							}}
						/>
					)}
				</div>

				{/* Sticky Order Summary */}
				{state.step !== 'confirm' && (
					<CheckoutSummary
						orderAmount={orderAmount}
						deliveryInfo={state.deliveryInfo}
						dmTips={state.dmTips}
						orderType={state.orderType}
					/>
				)}
			</div>
		</div>
	);
}