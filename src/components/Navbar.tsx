import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-emerald-600">FRA-Mitra</div>
        <div className="space-x-4">
          <Link href="/signin" className="text-slate-600 hover:text-slate-800 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="text-slate-600 hover:text-slate-800 transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;