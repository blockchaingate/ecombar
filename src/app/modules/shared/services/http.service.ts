import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectToken } from 'src/app/store/selectors/user.selector';

interface OPTIONS {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    // responseType: "arraybuffer";
    withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
    constructor(private http: HttpClient, private storage: StorageService, private store: Store) { }

    get(path: string, jwtAuth = false, pubkey = true): Observable<any> {
        const url = environment.endpoints.blockchaingate + path;
        console.log('url for get==', url);
        const ret = new Observable<any>((observer) => {
            if(jwtAuth === true) {
                this.store.select(selectToken).subscribe(
                    (token: string) => {
                        console.log('token=', token);
                        if(!token) {
                            observer.error('Token not exists');
                        } else {
                            const httpHeaders = new HttpHeaders({
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            });
                            const options: OPTIONS = {
                                headers: httpHeaders
                            };   
                            this.http.get(url, options).subscribe(
                                (res) => {
                                    observer.next(res);
                                },
                                err => { 
                                  observer.error(err)
                                  //this.errMsg = 'Invalid email or password';
                                }
                            );
                        }
                    });
            } else if (pubkey === true) {
                const httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                const options: OPTIONS = {
                    headers: httpHeaders
                };  
                this.http.get(url, options).subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    err => {
                      observer.error(err)
                      //this.errMsg = 'Invalid email or password';
                    }
                );
            } else {
                const httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                const options: OPTIONS = {
                    headers: httpHeaders
                };  
                this.http.get(url, options).subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    err => { 
                      observer.error(err)
                      //this.errMsg = 'Invalid email or password';
                    }
                );
            }

        });
        return ret;
    }

    post(path: string, data: any, jwtAuth = false, pubkey = true): Observable<any> {
        const url = environment.endpoints.blockchaingate + path;
        data.appId = environment.appid;

        const ret = new Observable<any>((observer) => {
            if(jwtAuth === true) {
                this.store.select(selectToken).subscribe(
                    (token: string) => {
                        console.log('token=', token);
                        if(!token) {
                            observer.error('Token not exists');
                        } else {
                            const httpHeaders = new HttpHeaders({
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            });
                            const options: OPTIONS = {
                                headers: httpHeaders
                            };   
                            
                            this.http.post(url, data, options).subscribe(
                                (res) => {
                                    observer.next(res);
                                },
                                err => { 
                                  observer.error(err)
                                  //this.errMsg = 'Invalid email or password';
                                }
                            );                       
                        }
                    });                
                } else if (pubkey === true) {
                    const httpHeaders = new HttpHeaders({
                        'Content-Type': 'application/json'
                    });
                    const options: OPTIONS = {
                        headers: httpHeaders
                    };   
                    
                    this.http.post(url, data, options).subscribe(
                        (res) => {
                            observer.next(res);
                        },
                        err => { 
                          observer.error(err)
                          //this.errMsg = 'Invalid email or password';
                        }
                    );                       
        } else {
                const httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                const options: OPTIONS = {
                    headers: httpHeaders
                };  
                this.http.post(url, data, options).subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    err => { 
                      observer.error(err)
                      //this.errMsg = 'Invalid email or password';
                    }
                );                           
            }

        });
        return ret;
        /*
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            if(!this.storage || !this.storage.token) {
                const ret = new Observable((observer) => {
                    observer.error('Token not exists');
                });
                return ret;
            }
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = environment.appid;
        const url = environment.endpoints.blockchaingate + path;
        console.log('url=', url);
        console.log('data=', data);
        return this.http.post(url, data, options);
        */
    }

    put(path: string, data: any, jwtAuth = false, pubkey = true): Observable<any> {
        const url = environment.endpoints.blockchaingate + path;
        data.appId = environment.appid;
        const ret = new Observable<any>((observer) => {
            if(jwtAuth === true) {
                this.store.select(selectToken).subscribe(
                    (token: string) => {
                        console.log('token=', token);
                        if(!token) {
                            observer.error('Token not exists');
                        } else {
                            const httpHeaders = new HttpHeaders({
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            });
                            const options: OPTIONS = {
                                headers: httpHeaders
                            };   
                            
                            this.http.put(url, data, options).subscribe(
                                (res) => {
                                    observer.next(res);
                                },
                                err => { 
                                  observer.error(err)
                                  //this.errMsg = 'Invalid email or password';
                                }
                            );                       
                        }
                    });
                } else if (pubkey === true) {
                    const httpHeaders = new HttpHeaders({
                        'Content-Type': 'application/json'
                    });
                    const options: OPTIONS = {
                        headers: httpHeaders
                    };   
                    
                    this.http.put(url, data, options).subscribe(
                        (res) => {
                            observer.next(res);
                        },
                        err => { 
                          observer.error(err)
                          //this.errMsg = 'Invalid email or password';
                        }
                    );                       
        } else {
                const httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                const options: OPTIONS = {
                    headers: httpHeaders
                };  
                this.http.put(url, data, options).subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    err => { 
                      observer.error(err)
                      //this.errMsg = 'Invalid email or password';
                    }
                );                           
            }

        });
        return ret;
        /*
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = this.storage.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.put(url, data, options);
        */
    }

    delete(path: string, jwtAuth = false, pubkey = true): Observable<any> {
        const url = environment.endpoints.blockchaingate + path;
        const ret = new Observable<any>((observer) => {
            if(jwtAuth === true) {
                this.store.select(selectToken).subscribe(
                    (token: string) => {
                        console.log('token=', token);
                        if(!token) {
                            observer.error('Token not exists');
                        } else {
                            const httpHeaders = new HttpHeaders({
                                'Content-Type': 'application/json',
                                'x-access-token': token
                            });
                            const options: OPTIONS = {
                                headers: httpHeaders
                            };   
                            
                            this.http.delete(url, options).subscribe(
                                (res) => {
                                    observer.next(res);
                                },
                                err => { 
                                  observer.error(err)
                                  //this.errMsg = 'Invalid email or password';
                                }
                            );
                        }
                    });                
                } else if (pubkey === true) {
                    const httpHeaders = new HttpHeaders({
                        'Content-Type': 'application/json'
                    });
                    const options: OPTIONS = {
                        headers: httpHeaders
                    };   
                    
                    this.http.delete(url, options).subscribe(
                        (res) => {
                            observer.next(res);
                        },
                        err => { 
                          observer.error(err)
                          //this.errMsg = 'Invalid email or password';
                        }
                    );
        } else {
                const httpHeaders = new HttpHeaders({
                    'Content-Type': 'application/json'
                });
                const options: OPTIONS = {
                    headers: httpHeaders
                };  
                this.http.delete(url,  options).subscribe(
                    (res) => {
                        observer.next(res);
                    },
                    err => { 
                      observer.error(err)
                      //this.errMsg = 'Invalid email or password';
                    }
                );                           
            }

        });
        return ret;        
        /*
        let httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        if (jwtAuth === true) {
            httpHeaders = new HttpHeaders({
                'Content-Type': 'application/json',
                'x-access-token': this.storage.token
            });
        }
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.delete(url, options);
        */
    }

    /*
    getPrivate(path: string, token: string): Observable<any> {
        if (!token) {
            token = this.storage.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options: OPTIONS = {
            headers: httpHeaders
        };
        const url = environment.endpoints.blockchaingate + path;
        return this.http.get(url, options);
    }

    postPrivate(path: string, data: any, token: string): Observable<any> {
        if (!token) {
            token = this.storage.token;
        }

        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'x-access-token': token
        });
        const options: OPTIONS = {
            headers: httpHeaders
        };
        data.appId = this.storage.appId;
        const url = environment.endpoints.blockchaingate + path;
        return this.http.post(url, data, options);
    }
    */
    // fullUrl: http://...  or https://...
    getRaw(fullUrl: string, options?:any): Observable<any> {
        return this.http.get(fullUrl, options);
    }

    // fullUrl: http://...  or https://...
    postRaw(fullUrl: string, data: any, options?: OPTIONS): Observable<any> {
        return this.http.post(fullUrl, data, options);
    }

    uploadFile(url: string, contenType: string, file: File) {
        contenType = contenType.replace('+', '/');
        contenType = 'application/octet-stream';
        const httpHeaders = new HttpHeaders({ 'Content-Type': contenType, 'x-amz-acl': 'public-read' });
        const options: OPTIONS = {
            headers: httpHeaders,
            reportProgress: true
        };
        return this.http.put(url, file, options);
    }
}
