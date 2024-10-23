import { startCase } from 'lodash';
import { auth } from '@clerk/nextjs/server';

import { OrgControl } from './_components/org-control';

export async function generateMetadata() {
  const { orgSlug } = await auth();

  return {
    title: startCase(orgSlug ?? 'organization'),
  };
}

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationIdLayout;
