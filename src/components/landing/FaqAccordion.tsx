import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'How fast is the AI background removal?',
      answer:
        'SnapCut AI processes high-resolution images in approximately 1.5 to 3 seconds, delivering a clean transparent PNG cutout ready for download.',
    },
    {
      question: 'How do I pay with bKash in Bangladesh?',
      answer:
        'We have integrated the official bKash Payment Gateway. Select any Credit Pack or Pro Plan on the pricing page, click "Pay with bKash", and complete the payment directly using your bKash mobile number, OTP, and PIN in Bangladeshi Taka (BDT). Credits are automatically added to your account instantly.',
    },
    {
      question: 'Are my uploaded photos stored permanently?',
      answer:
        'No. SnapCut AI has a strict 24-hour ephemeral retention policy. Both the original photo and the processed PNG cutout are automatically deleted from our temporary storage after 24 hours. We respect your privacy and never use your images for training.',
    },
    {
      question: 'Can I use SnapCut AI for free?',
      answer:
        'Yes! Every registered user receives 5 free high-definition background removals every single day. If you need high volume for e-commerce, client projects, or agency work, you can purchase affordable BDT credit packs anytime.',
    },
    {
      question: 'Do you offer a Developer REST API?',
      answer:
        'Yes! SnapCut AI includes a high-speed RESTful Developer API with secure hashed API keys, fast response times, and standard JSON responses for integrating automated background removal into your e-commerce platform, mobile app, or workflow.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="rounded-2xl bg-card border border-border-subtle overflow-hidden transition-colors hover:border-brand-blue/30"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-sm sm:text-base font-bold text-text-primary flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-brand-cyan shrink-0" />
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className={`w-5 h-5 text-text-muted shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-brand-cyan' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-border-subtle/50 animate-in fade-in duration-200">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
