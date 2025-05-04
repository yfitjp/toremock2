'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfilePage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const useAuth_1 = require("@/app/hooks/useAuth");
const auth_firebase_1 = require("@/app/lib/auth-firebase");
const framer_motion_1 = require("framer-motion");
function ProfilePage() {
    const router = (0, navigation_1.useRouter)();
    const { user, loading } = (0, useAuth_1.useAuth)();
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [isSubmitting, setIsSubmitting] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!loading && !user) {
            router.push('/auth/signin');
            return;
        }
        if (user) {
            setName(user.displayName || '');
            setEmail(user.email || '');
        }
    }, [user, loading, router]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        setIsSubmitting(true);
        setMessage(null);
        try {
            await (0, auth_firebase_1.updateUserProfile)(user, name);
            setMessage({
                type: 'success',
                text: 'プロフィールが更新されました',
            });
        }
        catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: 'プロフィールの更新中にエラーが発生しました',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    if (loading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>);
    }
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">プロフィール設定</h1>

          {message && (<div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>)}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                お名前
              </label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required/>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                メールアドレス
              </label>
              <input id="email" type="email" value={email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"/>
              <p className="mt-1 text-xs text-gray-500">
                メールアドレスは変更できません
              </p>
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={() => router.push('/mypage')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                キャンセル
              </button>
              <button type="submit" disabled={isSubmitting} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {isSubmitting ? '更新中...' : '更新する'}
              </button>
            </div>
          </form>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
