import {HttpClient, HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({

  providedIn: 'root'

})

export class UploadService { 

    SERVER_URL: string;

    constructor(private apiServ: ApiService) { 
    }

    public upload(formData) {
//x-access-token
        return this.apiServ.uploadFile('upload/single', formData);

    }

}