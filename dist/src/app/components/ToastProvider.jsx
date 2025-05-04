'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToastProvider = ToastProvider;
const useToast_1 = require("../hooks/useToast");
const Toast_1 = require("./Toast");
function ToastProvider({ children }) {
    const { toasts, removeToast } = (0, useToast_1.useToast)();
    return (<>
      {children}
      <Toast_1.ToastContainer toasts={toasts} onRemove={removeToast}/>
    </>);
}
