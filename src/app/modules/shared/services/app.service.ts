import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { App } from '../models/app';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private _name: string;
  private _app: App;

  constructor(private storage: StorageService) {}

  get id(): string {
    return this.storage.appId;
  }

  set id(appId: string) {
    this.storage.appId = appId;
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
