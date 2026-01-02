import { CookiePolicy } from '../components/CookiePolicy';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <CookiePolicy />
      <Footer />
    </div>
  );
}
