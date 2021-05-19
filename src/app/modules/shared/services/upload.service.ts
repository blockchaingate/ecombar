import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

interface UploadData { fileName: string; docType: string; fileType: string; memberId?: string; productId?: string; serviceId?: string; objectId?: string; pubkey?: string }

export enum DocType { KYC = 'KYC', PRODUCT = 'PRODUCT', SERVICE = 'SERVICE', OTHER = 'OTHER' };

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpService) { }

  uploadFile(fileToUpload: File, docType: DocType, objectId: string) {
    return this.applyPresignedUrl(fileToUpload.name, fileToUpload.type, docType, objectId).subscribe(
      (url: string) => this.uploadFileToSignedUrl(url, fileToUpload.type, fileToUpload));
  }

  // docType: MUST be one of: KYC, PRODUCT or SERVICE
  // objectId: if docType=KYC, objectId=memberId; if docType=PRODUCT
  applyPresignedUrl(fileName: string, fileType: string, docType: DocType, objectId: string) {
    const data: UploadData = { fileName, fileType, docType, pubkey: 'ABCDEFG' };
    if (docType === DocType.KYC) {
      data.memberId = objectId;
    } else if (docType === DocType.PRODUCT) {
      data.productId = objectId;
    } else if (docType === DocType.SERVICE) {
      data.serviceId = objectId;
    } else {
      data.objectId = objectId;
    }

    return this.http.post('s3/apply-upload-permit', data);
  }

  uploadFileToSignedUrl(presignedUrl: string, contentType: string, fileToUpload: File) {
    return this.http.uploadFile(presignedUrl, contentType, fileToUpload);
  }
}