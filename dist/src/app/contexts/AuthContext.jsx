'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
const react_1 = require("react");
const firebase_1 = require("@/app/lib/firebase");
const AuthContext = (0, react_1.createContext)({
    user: null,
    loading: true,
});
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsubscribe = firebase_1.auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    return (<AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>);
}
function useAuth() {
    return (0, react_1.useContext)(AuthContext);
}
