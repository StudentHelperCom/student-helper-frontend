import { useEffect, useState } from 'react';
import { cdn } from '@src/services/cdn';

export function useUpload() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(file: File) {
    setError(null);

    try {
      const result = await cdn.uploadFile(file);
      setStatus(result.message);
    } catch (err) {
      setError('Error uploading file :(');
    }
  }

  return { handleUpload, status, error };
}