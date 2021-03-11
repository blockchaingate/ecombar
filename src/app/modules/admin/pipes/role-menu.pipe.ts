import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'roleMenu'})
export class RoleMenuPipe implements PipeTransform {
  transform(menu: any, role?: string): number {
      if(!role) {
          return menu;
      }
      return menu.filter(item => item.roles.indexOf(role) >= 0);
  }
}