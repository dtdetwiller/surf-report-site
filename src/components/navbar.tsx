import { useSession } from "next-auth/react";
import Image from "next/image";

const Navbar: React.FC = () => {

  const { data: sessionData } = useSession();

  console.log(sessionData)

  return (
    <nav className="flex justify-between items-center text-white p-6">
      <div className="text-white text-xl">
        Ones 🌊
      </div>

      { sessionData && sessionData.user.image &&
        <Image 
          className="rounded-full border border-2 border-white"
          src={sessionData.user.image}
          alt=""
          height={50}
          width={50}
        />
      }
    </nav>
  );
}

export default Navbar;