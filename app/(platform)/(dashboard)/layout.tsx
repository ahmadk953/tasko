import { Navbar } from "./_components/Navbar";

const DashbordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      {children}
    </div>
  );
};

export default DashbordLayout;
