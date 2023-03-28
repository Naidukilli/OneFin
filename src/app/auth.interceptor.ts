import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    // const token: string = this.authService.getAccessToken();
    // if (token) {
    // const headers: any = {};
    // headers.Authorization = `Bearer ${token}`;
    //   const authReq = req.clone({ setHeaders: headers });
    //   return next.handle(authReq);
    // }

    return next.handle(req);
  }
}