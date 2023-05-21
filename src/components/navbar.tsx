import { faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

const Navbar: React.FC = () => {

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 flex justify-between items-center text-white p-4">
      <Link href="/" className="text-white text-2xl">
        <FontAwesomeIcon icon={faWater} />
      </Link>
    </nav>
  );
}

export default Navbar;