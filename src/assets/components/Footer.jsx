import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTelegram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="mx-auto my-3 w-full max-w-[1490px] rounded-lg bg-white px-8 py-4 shadow-2xl">
      <div className="flex flex-col">
        <div className="flex flex-col items-center justify-between border-b border-gray-300 pb-2 text-[12px] text-gray-800 sm:flex-row sm:text-[14px] md:text-[18px]">
          <span>+380 934 599 239</span>
          <span>viktor.luka.oi.2023@lpnu.ua</span>
          <span>Лука Віктор</span>
        </div>
        <div className="mt-[20px] flex flex-col-reverse items-center justify-between md:flex-row">
          <p className="text-gray-500">© 2025 Food. Всі права захищені.</p>
          <div className="flex gap-5 text-[22px]">
            <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-300">
              <FontAwesomeIcon icon={faInstagram} />
            </button>
            <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-300">
              <FontAwesomeIcon icon={faTelegram} />
            </button>
            <button className="flex h-[50px] w-[50px] items-center justify-center rounded-lg p-2 transition duration-300 ease-in-out hover:bg-gray-300">
              <FontAwesomeIcon icon={faTiktok} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
