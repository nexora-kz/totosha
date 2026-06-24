import { redirect } from 'next/navigation';

export default function CrmLoginRedirect() {
  redirect('/office/login');
}
