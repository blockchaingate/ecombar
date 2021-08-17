import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { themeEvn } from 'src/environments/themeEnv';

@Injectable({
  providedIn: 'root'
})

export class ThemeService {

  private messageSource = new BehaviorSubject(themeEvn.defaultTheme);
  currentMessage = this.messageSource.asObservable();

  constructor() {
    console.log("Default theme: " + themeEvn.defaultTheme);
    
   }

  changeMessage(theme: string) {
    this.messageSource.next(theme);
    console.log("Current theme: " + theme);
  }
}
