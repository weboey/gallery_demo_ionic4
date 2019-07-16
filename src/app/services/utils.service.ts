import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private userAgent = window.navigator.userAgent;
  constructor() { }
  isIOSSafari(): boolean {
    return !!this.userAgent.match(/(iPhone | iPad).*(Safari)/i)
  }

  isIOS(): boolean {
    return !!this.userAgent.match(/(iPhone | iPad)/i)
  }
  toString(string: string): number {
    let hash = 0,
      char;
    if (string.length === 0) {
      return hash;
    }
    for (let i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
        // tslint:disable-next-line
      hash = (hash << 5) - hash + char;
        // tslint:disable-next-line
      hash = hash & hash;
    }
      return hash;
  }
  generateRandomString(count){
    let d = new Date().getTime();
    const str = "x".repeat(count || 16);
    return str.replace(/[xy]/g,function(c){
        const r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c==="x" ? r : (r&0x7|0x8)).toString(16);
    });
  }
}
