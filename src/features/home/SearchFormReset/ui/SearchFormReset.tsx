"use client";

import { XIcon } from "lucide-react";
import Link from "next/link";

export const SearchFormReset: React.FC = () => {
  const reset = () => {
    const form = document.querySelector(".search-form");
    if (form instanceof HTMLFormElement && form) form.reset();
  };

  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn text-white">
        <XIcon className="size-5" />
      </Link>
    </button>
  );
};
