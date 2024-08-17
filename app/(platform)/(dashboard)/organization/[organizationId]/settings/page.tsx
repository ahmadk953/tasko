import { OrganizationProfile } from '@clerk/nextjs';

const SettingsPage = () => {
  return (
    <div className='w-full'>
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: {
              boxShadow: 'none',
              width: '100%',
            },
            card: {
              border: '1px solid #e5e5e5',
              boxShadow: 'none',
              width: '100%',
            },
          },
        }}
        routing='hash'
      />
    </div>
  );
};

export default SettingsPage;
