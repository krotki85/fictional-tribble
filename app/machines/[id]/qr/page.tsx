import { getMachine } from '@/lib/actions';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';
import PrintQRClient from './print-qr-client';

export const dynamic = 'force-dynamic';

export default async function PrintQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const machine = await getMachine(parseInt(id));
  
  if (!machine) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const reportUrl = `${baseUrl}/report/${machine.id}`;
  
  const qrCodeDataUrl = await QRCode.toDataURL(reportUrl, {
    width: 600,
    margin: 2,
  });

  return (
    <PrintQRClient
      machineName={machine.name}
      machineLocation={machine.location}
      serialNumber={machine.serial_number}
      qrCodeDataUrl={qrCodeDataUrl}
      reportUrl={reportUrl}
    />
  );
}
