import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { CrmLoginForm } from '../../../components/CrmLoginForm';
import { CRM_SESSION_COOKIE, isCrmAuthConfigured, verifyCrmSessionToken } from '../../../lib/crmAuth';

export default async function OfficeLoginPage() {
  const store = await cookies();
  if (verifyCrmSessionToken(store.get(CRM_SESSION_COOKIE)?.value)) redirect('/office/leads');
  return <div className="crm-login-screen"><CrmLoginForm configured={isCrmAuthConfigured()} /></div>;
}
