import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
  output: 'export',  // Ini mengaktifkan static export
  images: {
    unoptimized: true,  // Wajib jika pakai static export
  },
};

export default nextConfig;
