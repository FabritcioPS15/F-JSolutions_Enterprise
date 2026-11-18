import React from 'react';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageBannerProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
}

const PageBanner: React.FC<PageBannerProps> = ({ title, subtitle, breadcrumbs }) => {
  return (
    <section className="relative w-full py-12 lg:py-16 bg-gray-950 overflow-hidden group">
      {/* Interactive Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-5%] w-64 h-64 rounded-full bubble-cyan bubble-float-1 opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
        <div className="absolute bottom-[-25%] right-[5%] w-80 h-80 rounded-full bubble-neon bubble-float-2 opacity-15 group-hover:opacity-30 transition-opacity duration-700"></div>
        <div className="absolute top-[10%] right-[-10%] w-72 h-72 rounded-full bubble-cyan bubble-float-2 opacity-10 group-hover:opacity-25 transition-opacity duration-700" style={{ animationDelay: '-4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-2.5 mb-8">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs sm:text-sm text-gray-400 reveal-visible">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {item.path ? (
                    <Link href={item.path} 
                      className="hover:text-[#41f0a5] transition-colors duration-300 font-medium"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-[#41f0a5] font-semibold">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <FaChevronRight className="text-[10px] opacity-30 mx-0.5" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </nav>
        )}

        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 reveal-visible leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base md:text-lg text-gray-400 reveal-visible max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
    </section>
  );
};

export default PageBanner;
