import Navbar from "./navbar";

type Props = {
  children: React.ReactNode;
}

const Layout = ({children} : Props) => {

  return (
    <div className="min-h-screen bg-gray-900 max-w-4xl mx-auto">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;