import { CreatePostFormEditorial } from '@/components/redesign/CreatePostFormEditorial';
import { HeaderEditorial } from '@/components/redesign/HeaderEditorial';

export const metadata = {
  title: 'Share Your Story | Fatherhood Is',
  description: 'Share what fatherhood means to you and get a beautiful AI-generated illustration',
};

export default function CreatePageRedesign() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderEditorial />

      <main className="max-w-[800px] mx-auto px-10 py-[80px]">
        {/* Title Section */}
        <div className="mb-[60px] pb-8 border-b-[3px] border-black">
          <div className="text-[13px] font-semibold tracking-[2px] uppercase mb-2">
            Contribute
          </div>
          <h1 className="text-[68px] font-normal leading-[1.1] tracking-tight mb-6">
            Share Your Definition
          </h1>
          <p className="text-[22px] leading-relaxed text-gray-700 font-normal">
            Tell us what fatherhood means to you in a single sentence. We&apos;ll create a beautiful illustration in the timeless style of &quot;Love Is...&quot; comics.
          </p>
        </div>

        {/* Form */}
        <div className="border-[3px] border-black p-[40px] bg-white shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
          <CreatePostFormEditorial />
        </div>

        {/* Examples */}
        <div className="mt-[60px] pt-8 border-t border-gray-200">
          <h3 className="text-[13px] font-semibold tracking-[2px] uppercase mb-6">
            Examples
          </h3>
          <div className="grid gap-4">
            <div className="p-5 border border-gray-300 hover:border-black transition-colors">
              <p className="text-[18px] italic leading-relaxed">
                &quot;...teaching my daughter to ride a bike&quot;
              </p>
            </div>
            <div className="p-5 border border-gray-300 hover:border-black transition-colors">
              <p className="text-[18px] italic leading-relaxed">
                &quot;...reading bedtime stories every night&quot;
              </p>
            </div>
            <div className="p-5 border border-gray-300 hover:border-black transition-colors">
              <p className="text-[18px] italic leading-relaxed">
                &quot;...watching them take their first steps&quot;
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-[3px] border-black py-10 mt-[100px]">
        <div className="max-w-[1100px] mx-auto px-10 text-center">
          <p className="text-[13px] text-gray-600 tracking-wider">
            © 2026 Fatherhood Is. A literary platform for fathers.
          </p>
        </div>
      </footer>
    </div>
  );
}
