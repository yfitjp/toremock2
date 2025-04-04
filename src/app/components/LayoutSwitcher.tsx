'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutSwitcherProps {
  children: React.ReactNode;
}

export default function LayoutSwitcher({ children }: LayoutSwitcherProps) {
  const pathname = usePathname();

  // articles関連のパスではNavbarとFooterを表示しない
  const isArticlesRoute = pathname.startsWith('/articles');

  if (isArticlesRoute) {
    return <>{children}</>; // articlesルートでは children のみを返す
  }

  // それ以外のルートではNavbarとFooterでラップ
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 