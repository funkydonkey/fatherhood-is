import Link from 'next/link';

export function CreateSectionEditorial() {
  return (
    <section className="py-[120px] text-center border-t-[3px] border-b-[3px] border-black my-[100px]">
      <div className="max-w-[1100px] mx-auto px-10">
        <h2 className="text-[68px] font-normal mb-8 tracking-tight">
          Share Your Story
        </h2>

        <p className="text-[22px] text-gray-600 max-w-[700px] mx-auto mb-[60px] leading-relaxed">
          What does fatherhood mean to you? Share your definition and we&apos;ll create a beautiful &ldquo;Love Is...&rdquo; style illustration.
        </p>

        <Link
          href="/create"
          className="inline-block px-[50px] py-[18px] bg-black text-white text-sm font-semibold tracking-wide uppercase hover:bg-gray-900 transition-colors"
        >
          Create Your Post
        </Link>
      </div>
    </section>
  );
}
