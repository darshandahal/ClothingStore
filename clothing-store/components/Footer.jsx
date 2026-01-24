"use client";

import { Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#550000] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* ==== STORE INFO ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Mandira Fancy Store
          </h3>
          <p className="text-sm leading-relaxed text-gray-200">
            Mandira Fancy Store is located between the historic Patan Durbar Square
            and Lagankhel Bus Park. The store is well known for offering high-quality
            women’s clothing that combines modern fashion, comfort, and elegance.
          </p>
        </div>

        {/* ==== CONTACT INFO ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Contact Information
          </h3>
          <ul className="space-y-2 text-sm text-gray-200">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white" />
              <span>9861032516</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-white" />
              <span>Patan, Lalitpur, Nepal</span>
            </li>
            <li>
              <span className="font-medium text-white">TikTok:</span>{" "}
              <a
                href="https://www.tiktok.com/@mandira.fancy.store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-200 hover:text-white hover:underline"
              >
                @mandira.fancy.store
              </a>
            </li>
          </ul>
        </div>

        {/* ==== QUICK LINKS ==== */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/online-store"
                className="text-gray-200 hover:text-white hover:underline"
              >
                Women
              </Link>
            </li>
            <li>
              <Link
                href="/inventory"
                className="text-gray-200 hover:text-white hover:underline"
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-gray-200 hover:text-white hover:underline"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ==== COPYRIGHT ==== */}
      <div className="border-t border-white/20 py-4 text-center text-xs text-gray-200">
        © {new Date().getFullYear()} Mandira Fancy Store. All rights reserved.
      </div>
    </footer>
  );
}
