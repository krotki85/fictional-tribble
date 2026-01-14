'use client';

interface PrintQRClientProps {
  machineName: string;
  machineLocation: string | null;
  serialNumber: string | null;
  qrCodeDataUrl: string;
  reportUrl: string;
}

export default function PrintQRClient({
  machineName,
  machineLocation,
  serialNumber,
  qrCodeDataUrl,
  reportUrl,
}: PrintQRClientProps) {
  return (
    <div className="min-h-screen bg-white p-8">
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-content {
            page-break-inside: avoid;
          }
        }
      `}</style>

      <div className="max-w-2xl mx-auto">
        <div className="no-print mb-6 flex justify-between items-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            🖨️ Print QR Code
          </button>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>

        <div className="print-content border-4 border-black p-8 rounded-lg text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{machineName}</h1>
          
          {machineLocation && (
            <p className="text-xl text-gray-600 mb-2">
              📍 {machineLocation}
            </p>
          )}
          
          {serialNumber && (
            <p className="text-lg text-gray-600 mb-6">
              S/N: {serialNumber}
            </p>
          )}

          <div className="flex justify-center my-8">
            <div className="bg-white p-4 rounded-lg inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeDataUrl} alt="QR Code" className="w-96 h-96" />
            </div>
          </div>

          <div className="mt-8 pt-8 border-t-2 border-gray-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Report a Malfunction
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              Scan this QR code with your phone camera to report any issues
            </p>
            <div className="bg-gray-100 p-4 rounded-lg inline-block">
              <p className="text-sm text-gray-600 font-mono break-all">
                {reportUrl}
              </p>
            </div>
          </div>
        </div>

        <div className="no-print mt-8 text-center text-gray-600">
          <p>This page is optimized for printing. Click the Print button to generate a PDF or print directly.</p>
        </div>
      </div>
    </div>
  );
}
