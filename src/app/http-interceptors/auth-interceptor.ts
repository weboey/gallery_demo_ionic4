import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  static addToken(req: HttpRequest<any>, userId: string, token: string): HttpRequest<any> {
    return req.clone({
      url: req.url,
      setHeaders: {
        'X-UserId': userId || '',
        Authorization: 'Bearer ' + token
      }
    });
  }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.match(/\w(\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.ico)/i)) {
        return next.handle(req);
    }
    return next.handle(req.clone({url: 'http://47.112.218.7:80' + req.url}));
    // Get the auth token from the service.
    // send cloned request with header to the next handler.
    // return next.handle(req);
  }
}
