  
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs";
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LocalUploadService {

  constructor(private http: HttpClient) { }

  // file from event.target.files[0]
  // This service can't serve S3 uploading.
  uploadFileLocal(path: string, file: File): Observable<any> {
    const url = environment.endpoints.blockchaingate + path;
    let formData = new FormData();
    formData.append('upload', file);

    let params = new HttpParams();

    const options = {
      params: params,
      reportProgress: true,
    };

    //const req = new HttpRequest('POST', url, formData, options);
    return this.http.post(url, formData, options);
  }
}