import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { AuthService } from './auth.service';
import { App } from '../models/app';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _name: string;
  private _app: App;

  constructor(private authServ: AuthService, private storage: StorageMap) {}

  get id(): string {
    return this.authServ.appId;
  }

  set id(appId: string) {
    this.authServ.appId = appId;
  }

  get name() {
    return this._name;
  }

  set name(nam: string) {
    this._name = nam;
  }

  get app() {
    return this._app;
  }

  set app(newApp: App) {
    this._app= newApp;
  }
}
