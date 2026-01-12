import Link from 'next/link';
import { getMachine, getReports, updateReportStatus } from '@/lib/actions';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export default async function MachineDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = await getMachine(parseInt(id));
  
  if (!machine) {
    notFound();
  }

  const reports = await getReports(machine.id);
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const reportUrl = `${baseUrl}/report/${machine.id}`;
  
  const qrCodeDataUrl = await QRCode.toDataURL(reportUrl, {
    width: 300,
    margin: 2,
  });

  async function handleStatusUpdate(formData: FormData) {
    'use server';
    const reportId = parseInt(formData.get('reportId') as string);
    const status = formData.get('status') as string;
    await updateReportStatus(reportId, status);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{machine.name}</h1>
            <p className="text-gray-600">Machine Details & Reports</p>
          </div>
          <Link
            href="/machines"
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Machines
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Machine Information</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900">{machine.name}</p>
                </div>
                {machine.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Description:</span>
                    <p className="text-gray-900">{machine.description}</p>
                  </div>
                )}
                {machine.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <p className="text-gray-900">{machine.location}</p>
                  </div>
                )}
                {machine.serial_number && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Serial Number:</span>
                    <p className="text-gray-900">{machine.serial_number}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Added:</span>
                  <p className="text-gray-900">{new Date(machine.created_at).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Malfunction Reports</h2>
              </div>
              {reports.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  <p>No reports yet for this machine</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {reports.map((report) => (
                    <div key={report.id} className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="text-gray-900 font-medium mb-1">{report.issue_description}</p>
                          <div className="text-sm text-gray-600 space-y-1">
                            {report.reporter_name && <p>Reporter: {report.reporter_name}</p>}
                            {report.reporter_contact && <p>Contact: {report.reporter_contact}</p>}
                            <p>Reported: {new Date(report.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                        <form action={handleStatusUpdate}>
                          <input type="hidden" name="reportId" value={report.id} />
                          <select
                            name="status"
                            defaultValue={report.status}
                            onChange={(e) => e.currentTarget.form?.requestSubmit()}
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              report.status === 'pending'
                                ? 'bg-orange-100 text-orange-800'
                                : report.status === 'in_progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">QR Code</h2>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrCodeDataUrl} alt="QR Code" className="w-full max-w-xs" />
                </div>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Scan to report malfunctions
                </p>
                <div className="space-y-2 w-full">
                  <Link
                    href={`/machines/${machine.id}/qr`}
                    target="_blank"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Print QR Code
                  </Link>
                  <Link
                    href={`/report/${machine.id}`}
                    className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Report Malfunction
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">📱 Mobile Access</h3>
              <p className="text-sm text-blue-800">
                Print and attach this QR code to the machine. Workers can scan it with their phones to quickly report issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
