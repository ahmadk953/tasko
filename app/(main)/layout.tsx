import { Footer } from './_components/footer';
import { Navbar } from './_components/navbar';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full bg-slate-100'>
      <meta
        name='google-site-verification'
        content='PRxg9VJRF6bNC8Gn2foGdrSvXjqihsgL4w9HPTt5nVk'
      />
      <Navbar />
      <main className='bg-slate-100 pb-20 pt-40'>{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
