/** @type {import('next').NextConfig} */
import * as sass from 'sass'

const nextConfig = {
    sassOptions: {
        includePaths: ['./styles'],
      }
};

export default nextConfig;
