import { SearchFormReset } from "@/src/features/home";
import { SearchIcon } from "lucide-react";
import Form from "next/form";

export const SearchForm: React.FC<{ query?: string }> = ({ query }) => {
  return (
    <Form action={"/"} scroll={false} className="search-form">
      <input
        name="query"
        defaultValue={query}
        className="search-input"
        placeholder="Search Startups"
      />
      <div className="flex gap-2">
        {typeof query === "string" && <SearchFormReset />}
        <button type="submit" className="search-btn text-white">
          <SearchIcon className="size-5" />
        </button>
      </div>
    </Form>
  );
};
