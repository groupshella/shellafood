function StepConnector({ isActive }: { isActive: boolean }) {
	return (
		<div
			className={`flex-1 h-1 mx-2 sm:mx-3 lg:mx-4 transition-all duration-300 relative top-5 sm:top-6 ${
				isActive
					? "bg-green-600 dark:bg-green-500"
					: "bg-gray-300 dark:bg-gray-700"
			}`}
		/>
	);
}export default StepConnector;