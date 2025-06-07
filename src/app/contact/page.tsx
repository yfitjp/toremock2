import type { Metadata } from 'next';
import ContactForm from '../components/ContactForm';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'ToreMockに関するご質問・ご意見・ご要望はこちらのフォームからお問い合わせください。',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ContactForm />
      </div>
    </div>
  );
} 