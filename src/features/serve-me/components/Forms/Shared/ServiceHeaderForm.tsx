"use client";
interface ServiceHeaderInterface
{
    serviceName:string;
    description:string;
}
const ServiceHeaderForm=({serviceName,description}:ServiceHeaderInterface)=>{
    return <div className="mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200 dark:border-gray-700">
    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
        {serviceName}
    </h1>
    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
       {description}
    </p>
</div>
}
export default ServiceHeaderForm;