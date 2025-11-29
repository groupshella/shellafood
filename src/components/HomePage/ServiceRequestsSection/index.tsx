"use client";

import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Wrench, 
  Home, 
  Camera, 
  Package, 
  ArrowRight,
  Users,
  Clock,
  CheckCircle
} from "lucide-react";

export default function ServiceRequestsSection() {
  const router = useRouter();
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: isArabic ? "مزود خدمة" : "Service Providers",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: CheckCircle,
      value: "50,000+",
      label: isArabic ? "خدمة مكتملة" : "Completed Services",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      value: "< 24h",
      label: isArabic ? "متوسط وقت الاستجابة" : "Avg Response Time",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const topCategories = [
    {
      icon: Package,
      name: isArabic ? "خدمات التوصيل" : "Delivery Services",
      count: "2,500+",
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
    },
    {
      icon: Home,
      name: isArabic ? "خدمات منزلية" : "Home Services",
      count: "3,200+",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
    },
    {
      icon: Wrench,
      name: isArabic ? "صيانة وإصلاح" : "Maintenance",
      count: "1,800+",
      color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
    },
    {
      icon: Camera,
      name: isArabic ? "خدمات احترافية" : "Professional",
      count: "900+",
      color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 sm:mb-16"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Main Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 sm:p-8 md:p-12 shadow-2xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className={`flex flex-col ${isArabic ? "md:flex-row-reverse" : "md:flex-row"} md:items-center md:justify-between mb-6 sm:mb-8 gap-4 sm:gap-6`}>
            <div className={`${isArabic ? "text-right" : "text-left"} mb-0`}>
              <div className={`flex items-center gap-2 mb-3 ${isArabic ? "flex-row-reverse" : ""}`}>
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
                <span className="text-white/80 text-xs sm:text-sm font-medium">
                  {isArabic ? "جديد" : "NEW"}
                </span>
              </div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 ${isArabic ? "text-right" : "text-left"}`}>
                {isArabic ? "احتاج خدمة؟ اطلبها الآن" : "Need a Service? Request It"}
              </h2>
              <p className={`text-white/90 text-base sm:text-lg max-w-2xl ${isArabic ? "text-right" : "text-left"}`}>
                {isArabic 
                  ? "انشر طلبك واحصل على عروض من مزودي الخدمة المحترفين في دقائق"
                  : "Post your request and get proposals from professional service providers in minutes"
                }
              </p>
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/post-service-request')}
              className={`group bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 sm:gap-3 whitespace-nowrap ${isArabic ? "flex-row-reverse" : ""} w-full sm:w-auto justify-center`}
            >
              {isArabic ? "اطلب خدمة" : "Post Request"}
              <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isArabic ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
            </motion.button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 ${isArabic ? "text-right" : "text-left"}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 sm:mb-4 ${isArabic ? "ml-auto" : "mr-auto"} sm:${isArabic ? "ml-0" : "mr-0"}`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/80 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Top Categories */}
          <div>
            <h3 className={`text-white font-semibold text-base sm:text-lg mb-4 ${isArabic ? "text-right" : "text-left"}`}>
              {isArabic ? "الفئات الأكثر طلباً" : "Most Requested Categories"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {topCategories.map((category, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/provider/requests?category=${category.name}`)}
                  className={`bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:bg-white transition-all group ${isArabic ? "text-right" : "text-center"}`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${category.color} flex items-center justify-center mb-2 sm:mb-3 ${isArabic ? "ml-auto" : "mx-auto"}`}>
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="text-gray-900 dark:text-gray-100 font-semibold text-xs sm:text-sm mb-1">
                    {category.name}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs">
                    {category.count} {isArabic ? "مزود" : "providers"}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20">
            <h3 className={`text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6 text-center`}>
              {isArabic ? "كيف يعمل؟" : "How It Works?"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  step: "1",
                  title: isArabic ? "اطلب الخدمة" : "Post Request",
                  desc: isArabic ? "اشرح ما تحتاجه بالتفصيل" : "Describe what you need"
                },
                {
                  step: "2",
                  title: isArabic ? "استقبل العروض" : "Get Proposals",
                  desc: isArabic ? "استقبل عروض من المزودين" : "Receive provider proposals"
                },
                {
                  step: "3",
                  title: isArabic ? "اختر الأفضل" : "Choose Best",
                  desc: isArabic ? "قارن واختر العرض المناسب" : "Compare and select offer"
                },
                {
                  step: "4",
                  title: isArabic ? "أتمم العمل" : "Complete",
                  desc: isArabic ? "يتم العمل وتدفع بأمان" : "Work done & safe payment"
                }
              ].map((item, index) => (
                <div key={index} className={`text-center ${isArabic ? "text-right" : "text-left"} sm:text-center`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 sm:mb-3 text-white font-bold text-lg sm:text-xl">
                    {item.step}
                  </div>
                  <div className="text-white font-semibold mb-1 text-sm sm:text-base">
                    {item.title}
                  </div>
                  <div className="text-white/70 text-xs sm:text-sm">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Provider CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mt-4 sm:mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${isArabic ? "sm:flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 sm:gap-4 ${isArabic ? "flex-row-reverse" : ""} w-full sm:w-auto`}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div className={`${isArabic ? "text-right" : "text-left"} flex-1 sm:flex-none`}>
              <h3 className={`text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 ${isArabic ? "text-right" : "text-left"}`}>
                {isArabic ? "هل أنت مزود خدمة؟" : "Are you a Service Provider?"}
              </h3>
              <p className={`text-gray-600 dark:text-gray-300 text-xs sm:text-sm ${isArabic ? "text-right" : "text-left"}`}>
                {isArabic 
                  ? "انضم إلى آلاف المزودين واحصل على طلبات يومياً"
                  : "Join thousands of providers and get daily requests"
                }
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/provider/dashboard')}
            className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap ${isArabic ? "flex-row-reverse" : ""} w-full sm:w-auto justify-center`}
          >
            {isArabic ? "ابدأ كمزود" : "Start as Provider"}
            <ArrowRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
          </motion.button>
        </div>
      </motion.div>
    </motion.section>
  );
}