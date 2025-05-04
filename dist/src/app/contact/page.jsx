'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ContactPage;
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
function ContactPage() {
    const [formData, setFormData] = (0, react_1.useState)({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        // フォーム送信の処理を実装
        console.log('Form submitted:', formData);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    return (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">お問い合わせ</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                お名前
              </label>
              <input type="text" name="name" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={formData.name} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                メールアドレス
              </label>
              <input type="email" name="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={formData.email} onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-900">
                件名
              </label>
              <select name="subject" id="subject" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={formData.subject} onChange={handleChange}>
                <option value="">選択してください</option>
                <option value="general">一般的な質問</option>
                <option value="technical">技術的な質問</option>
                <option value="billing">料金に関する質問</option>
                <option value="other">その他</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-900">
                メッセージ
              </label>
              <textarea name="message" id="message" rows={6} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" value={formData.message} onChange={handleChange}/>
            </div>
            <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              送信する
            </button>
          </form>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
