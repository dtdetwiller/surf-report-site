import Navbar from "./navbar";

type Props = {
  children: React.ReactNode;
}

const Layout = ({children} : Props) => {

  return (
    <div className="min-h-screen bg-gray-900 max-w-4xl mx-auto">
      <Navbar />
      <main className="h-[calc(100vh-64px)] p-5">{children}</main>
    </div>
  );
};

export default Layout;