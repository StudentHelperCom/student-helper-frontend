'use strict';

import { cdn } from '@src/services/cdn';
import {UploadPayload} from "@src/types/api-requests.types";
import {AxiosResponse} from "axios";

export function useUpload() {

  async function handleUpload(uploadPayload: UploadPayload) {
    const response: AxiosResponse = await cdn.uploadFile(uploadPayload);

    return response;
  }

  return { handleUpload };
}