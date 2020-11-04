// src/app/auth/auth-guard.service.ts
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router, private storage: StorageService) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated(this.storage.token)) {
      this.router.navigate(['auth/signin']);
      return false;
    }
    return true;
  }
}