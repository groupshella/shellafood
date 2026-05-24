import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, XCircle, Info } from "lucide-react";

interface NotificationDialogProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  isArabic?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export const NotificationDialog: React.FC<NotificationDialogProps> = ({
  message,
  type,
  isVisible,
  onClose,
  isArabic = true,
  autoClose = true,
  autoCloseDelay = 5000,
}) => {
  // Auto-close timer
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseDelay, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: isArabic ? "نجح!" : "Success!",
      titleColor: "text-green-900",
      buttonBg: "bg-green-600 hover:bg-green-700",
      borderColor: "border-green-200",
    },
    error: {
      icon: XCircle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: isArabic ? "خطأ!" : "Error!",
      titleColor: "text-red-900",
      buttonBg: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-200",
    },
    info: {
      icon: Info,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: isArabic ? "معلومة" : "Info",
      titleColor: "text-blue-900",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200",
    },
  };

  const { icon: Icon, iconBg, iconColor, title, titleColor, buttonBg, borderColor } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden ${
              isArabic ? "text-right" : "text-left"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Top Border Accent */}
            <div className={`h-1.5 ${iconBg}`} />

            {/* Content */}
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${iconBg}`}
                >
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </motion.div>

                {/* Title */}
                <div className="flex-1 pt-1">
                  <h3 className={`text-xl font-bold ${titleColor} mb-2`}>
                    {title}
                  </h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={onClose}
                  className={`px-6 py-2.5 rounded-xl text-gray-800 font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${buttonBg}`}
                >
                  {isArabic ? "حسناً" : "OK"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};