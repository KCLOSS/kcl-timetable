import "tailwindcss/tailwind.css";
import "./global.css";

import type { AppProps } from "next/app";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import dayjs from "dayjs";
dayjs.extend(utc);
dayjs.extend(timezone);

(String.prototype as any).toTitleCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
