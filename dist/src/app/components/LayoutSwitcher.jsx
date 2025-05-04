'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayoutSwitcher;
const navigation_1 = require("next/navigation");
const Navbar_1 = __importDefault(require("./Navbar"));
const Footer_1 = __importDefault(require("./Footer"));
function LayoutSwitcher({ children }) {
    const pathname = (0, navigation_1.usePathname)();
    // articles関連のパスではNavbarとFooterを表示しない
    const isArticlesRoute = pathname.startsWith('/articles');
    if (isArticlesRoute) {
        return <>{children}</>; // articlesルートでは children のみを返す
    }
    // それ以外のルートではNavbarとFooterでラップ
    return (<div className="flex flex-col min-h-screen">
      <Navbar_1.default />
      <main className="flex-grow">
        {children}
      </main>
      <Footer_1.default />
    </div>);
}
