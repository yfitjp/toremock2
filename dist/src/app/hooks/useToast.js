'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useToast = useToast;
const react_1 = require("react");
function useToast() {
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const showToast = (0, react_1.useCallback)((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { message, type, id }]);
        // 3秒後に自動的に消える
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);
    const removeToast = (0, react_1.useCallback)((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);
    return {
        toasts,
        showToast,
        removeToast,
    };
}
