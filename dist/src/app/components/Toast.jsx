'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Toast = Toast;
exports.ToastContainer = ToastContainer;
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const toastColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
};
function Toast({ message, type, onClose }) {
    (0, react_1.useEffect)(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);
    return (<framer_motion_1.motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white ${toastColors[type]} shadow-lg`}>
      {message}
    </framer_motion_1.motion.div>);
}
function ToastContainer({ toasts, onRemove }) {
    return (<div className="fixed bottom-4 right-4 z-50">
      <framer_motion_1.AnimatePresence>
        {toasts.map((toast) => (<Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onRemove(toast.id)}/>))}
      </framer_motion_1.AnimatePresence>
    </div>);
}
