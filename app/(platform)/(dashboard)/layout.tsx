import { auth } from '@clerk/nextjs/server';

import { Navbar } from './_components/Navbar';

const DashbordLayout = ({ children }: { children: React.ReactNode }) => {
  auth().protect();

  return (
    <div className='h-full'>
      <Navbar />
      {children}
    </div>
  );
};

export default DashbordLayout;
