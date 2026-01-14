import { PostGridEditorial } from '@/components/redesign/PostGridEditorial';
import { HeroEditorial } from '@/components/redesign/HeroEditorial';
import { HeaderEditorial } from '@/components/redesign/HeaderEditorial';
import { CreateSectionEditorial } from '@/components/redesign/CreateSectionEditorial';
import { getPosts } from '@/lib/api';

export default async function RedesignPage() {
  const { posts } = await getPosts(1, 20, 'newest');

  return (
    <div className="min-h-screen bg-white">
      <HeaderEditorial />
      <HeroEditorial />

      <div className="max-w-[1100px] mx-auto px-10">
        <PostGridEditorial posts={posts} />
      </div>

      <CreateSectionEditorial />

      <footer className="border-t-[3px] border-black pt-20 pb-16">
        <div className="max-w-[1100px] mx-auto px-10">
          <div className="grid grid-cols-4 gap-16 mb-16">
            <div className="col-span-1">
              <h3 className="text-4xl font-normal italic mb-5">Fatherhood Is</h3>
              <p className="text-[17px] leading-relaxed text-gray-600">
                A literary platform celebrating the depth, wisdom, and love of fathers through shared stories and timeless art.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-6">Platform</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-600 hover:text-black transition-colors">Home</a></li>
                <li><a href="/create" className="text-gray-600 hover:text-black transition-colors">Create</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-6">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 hover:text-black transition-colors">About</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-base font-semibold mb-6">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-600 hover:text-black transition-colors">Privacy</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-black transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center pt-10 border-t border-gray-200 text-sm text-gray-500">
            <div>© 2026 Fatherhood Is. All rights reserved.</div>
            <div className="flex gap-7">
              <a href="#" className="hover:text-black transition-colors">Twitter</a>
              <a href="#" className="hover:text-black transition-colors">Instagram</a>
              <a href="#" className="hover:text-black transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
