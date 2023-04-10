import { faWater } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

const Navbar: React.FC = () => {

  const [showDropdown, setShowDropdown] = useState(false);
  const { data: sessionData } = useSession();

  return (
    <nav className="flex justify-between items-center text-white p-4">
      <div className="text-white text-2xl">
        <FontAwesomeIcon icon={faWater} />
      </div>

      { sessionData && sessionData.user.image &&

      <div className="relative inline-block text-left">
        <Image 
          className="rounded-full border border-2 border-white transition ease-out duration-500 active:scale-75"
          src={sessionData.user.image}
          alt=""
          height={32}
          width={32}
          onClick={() => setShowDropdown(!showDropdown)}
        />

        <div 
          className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-gray-400 ring-opacity-5 focus:outline-none"
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="menu-button"
          style={{display: showDropdown ? "block" : "none"}}
        >
          <div className="py-1" role="none">
            <button className="text-white block w-full px-4 py-2 text-left text-sm" onClick={() => void signOut()}>Sign out</button>
          </div>
        </div>
      </div>
      }
    </nav>
  );
}

export default Navbar;