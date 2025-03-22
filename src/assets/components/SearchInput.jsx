import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchInput = ({ value, onChange, onSearch }) => {
  return (
    <div className="flex w-[80%] justify-end gap-2 sm:w-[35%]">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Пошук..."
        className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-700 focus:border-gray-400 focus:outline-none"
      />
      <button
        onClick={onSearch}
        className="h-[50px] w-[50px] rounded-lg bg-gray-300 p-2 transition duration-300 ease-in-out hover:bg-gray-400"
      >
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default SearchInput;
