import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StorageService } from './storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from "rxjs";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: string;
  constructor(private httpClient: HttpClient, private storageServ: StorageService) {
  }


  formHttpOption()  {


    const observable = new Observable(subscriber => {
      if(!this.token) {
        this.storageServ.getToken().subscribe(
          (token: any) => {
            this.token = token;
            const httpOptions = {
              headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'x-access-token': this.token
              })
            };	
            subscriber.next(httpOptions);    
          }
        );
      } else {
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type':  'application/json',
            'x-access-token': this.token
          })
        };	
        subscriber.next(httpOptions);  
      }
    });    

    return observable;
  }

  qrcodepay(data) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway';
    return this.httpClient.post(url, data);
  }

  checkPaymentStatus(code: string) {
    const url = environment.endpoints.blockchaingate + 'payment/gateway/' + code;
    return this.httpClient.get(url);
  }

  postPrivate(endpoint, data) {
    const observable = new Observable(subscriber => {
      this.formHttpOption().subscribe(
        (httpOptions: any) => {
          this.httpClient
            .post(environment.endpoints.blockchaingate + endpoint, data, httpOptions).subscribe(
              (res: any) => {
                subscriber.next(res);  
              }
            );
        }
      );
    });

    return observable;

  }

  putPrivate(endpoint, data) {
    const observable = new Observable(subscriber => {
      this.formHttpOption().subscribe(
        (httpOptions: any) => {
          this.httpClient
            .put(environment.endpoints.blockchaingate + endpoint, data, httpOptions).subscribe(
              (res: any) => {
                subscriber.next(res);  
              }
            );
        }
      );
    });

    return observable;

  }

	public uploadFile(endpoint, formData: any ) {
    console.log('formData===', formData);
    
    const observable = new Observable(subscriber => {
      this.storageServ.getToken().subscribe(
        (token: any) => {


          this.httpClient
          .post(
            environment.endpoints.blockchaingate + endpoint,
            formData, // Send the File Blob as the POST body.
            {
              // NOTE: Because we are posting a Blob (File is a specialized Blob
              // object) as the POST body, we have to include the Content-Type
              // header. If we don't, the server will try to parse the body as
              // plain text.
              headers: {
                'x-access-token': token
              },
              reportProgress: true,
              observe: 'events'
            }
          ).subscribe(
            (res: any) => {
              subscriber.next(res);  
            }
          );


        }
      );
    });

    return observable;
	}



  getPrivate(endpoint) {

    const observable = new Observable(subscriber => {
      this.formHttpOption().subscribe(
        (httpOptions: any) => {
          this.httpClient
            .get(environment.endpoints.blockchaingate + endpoint, httpOptions).subscribe(
              (res: any) => {
                subscriber.next(res);  
              }
            );
        }
      );
    });

    return observable;

  }

  getPublic(endpoint) {
    const url = environment.endpoints.blockchaingate + endpoint;
    console.log('url==', url);
    return this.httpClient.get(url);
  }

  postPublic(endpoint, data) {
    return this.httpClient
    .post(environment.endpoints.blockchaingate + endpoint, data);    
  }
}