import Link from 'next/link';
import { getMachine, addReport } from '@/lib/actions';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ReportMalfunctionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { id } = await params;
  const { success } = await searchParams;
  const machine = await getMachine(parseInt(id));
  
  if (!machine) {
    notFound();
  }

  async function handleSubmitReport(formData: FormData) {
    'use server';
    await addReport(formData);
    redirect(`/report/${id}?success=true`);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Report Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reporting the issue. The maintenance team has been notified and will address it soon.
            </p>
            <div className="space-y-3">
              <Link
                href={`/report/${id}`}
                className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Report Another Issue
              </Link>
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-600 text-white p-6">
            <div className="flex items-center mb-2">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Report Malfunction</h1>
                <p className="text-red-100 text-sm">Quick issue reporting</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h2 className="font-semibold text-blue-900 text-lg mb-2">{machine.name}</h2>
              {machine.location && (
                <p className="text-blue-800 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {machine.location}
                </p>
              )}
              {machine.serial_number && (
                <p className="text-blue-800 text-sm mt-1">S/N: {machine.serial_number}</p>
              )}
            </div>

            <form action={handleSubmitReport} className="space-y-6">
              <input type="hidden" name="machine_id" value={machine.id} />
              
              <div>
                <label htmlFor="issue_description" className="block text-sm font-medium text-gray-700 mb-2">
                  What&apos;s the problem? *
                </label>
                <textarea
                  id="issue_description"
                  name="issue_description"
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  placeholder="Describe the issue in detail..."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Be as specific as possible to help the maintenance team
                </p>
              </div>

              <div>
                <label htmlFor="reporter_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (optional)
                </label>
                <input
                  type="text"
                  id="reporter_name"
                  name="reporter_name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="reporter_contact" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Info (optional)
                </label>
                <input
                  type="text"
                  id="reporter_contact"
                  name="reporter_contact"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                  placeholder="Email or phone number"
                />
                <p className="mt-2 text-sm text-gray-500">
                  In case we need to follow up with you
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-lg shadow-lg"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
