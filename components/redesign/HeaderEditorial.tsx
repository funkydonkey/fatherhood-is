import Link from 'next/link';

export function HeaderEditorial() {
  return (
    <header className="py-10 border-b-[3px] border-black">
      <div className="max-w-[1100px] mx-auto px-10">
        <div className="flex justify-between items-baseline">
          <Link href="/redesign" className="text-[42px] font-semibold italic text-black tracking-tight">
            Fatherhood Is
          </Link>

          <div className="flex items-baseline gap-10">
            <div className="text-[13px] text-gray-600 tracking-wider">
              Volume I, Issue 1 — 2026
            </div>
            <nav>
              <ul className="flex gap-8">
                <li>
                  <Link href="/redesign" className="text-base hover:opacity-60 transition-opacity">
                    Stories
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-base hover:opacity-60 transition-opacity">
                    Original
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="text-base hover:opacity-60 transition-opacity">
                    Create
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
