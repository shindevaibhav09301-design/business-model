import { NextRequest } from 'next/server';
import { appStore } from '@/lib/storage/store';
import { discoveryEventEmitter } from '@/lib/discovery/engine/orchestrator';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const jobId = params.id;
  const currentJob = appStore.getDiscoveryJob(jobId);

  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Send initial status immediately
  if (currentJob) {
    const initialData = `data: ${JSON.stringify({ job: currentJob })}\n\n`;
    writer.write(encoder.encode(initialData)).catch(() => {});
  }

  // Listener for live updates
  const eventName = `job-update-${jobId}`;
  const onUpdate = (payload: any) => {
    try {
      const data = `data: ${JSON.stringify(payload)}\n\n`;
      writer.write(encoder.encode(data)).catch(() => {});
      if (payload.job?.status === 'COMPLETED' || payload.job?.status === 'FAILED') {
        cleanup();
      }
    } catch (e) {
      cleanup();
    }
  };

  const cleanup = () => {
    discoveryEventEmitter.off(eventName, onUpdate);
    writer.close().catch(() => {});
  };

  discoveryEventEmitter.on(eventName, onUpdate);

  // If already completed or failed, close after sending initial
  if (currentJob && (currentJob.status === 'COMPLETED' || currentJob.status === 'FAILED')) {
    setTimeout(cleanup, 1000);
  }

  // Auto timeout after 5 minutes
  setTimeout(cleanup, 300000);

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
