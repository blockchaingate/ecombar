import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

interface UploadData { docType: string, fileType: string, memberId?: string, productId?: string, serviceId?: string, objectId?: string };

export enum DocType { KYC = 'KYC', PRODUCT = 'PRODUCT', SERVICE = 'SERVICE', OTHER = 'OTHER' };

@Injectable({ providedIn: 'root' })
export class UploadService {
  constructor(private http: HttpService) { }

  uploadFile(fileToUpload: File, docType: DocType, objectId: string) {
    return this.applyPresignedUrl(fileToUpload, docType, objectId).subscribe(
      (url: string) => { return this.uploadFileToSignedUrl(url, fileToUpload); });
  }

  // docType: MUST be one of: KYC, PRODUCT or SERVICE
  // objectId: if docType=KYC, objectId=memberId; if docType=PRODUCT, 
  applyPresignedUrl(fileToUpload: File, docType: DocType, objectId: string) {
    let data: UploadData = { docType: docType, fileType: fileToUpload.type };
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

  uploadFileToSignedUrl(presignedUrl: string, fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(presignedUrl, formData, true);
  }
}