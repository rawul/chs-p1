import { Injectable } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>, next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const jwt = localStorage.getItem('token');
        let authReq = request.clone();
        if (jwt && (request.url.indexOf("/survey/") === -1 || request.url.indexOf("answers") !== -1)) {
            console.log(jwt);
            authReq = request.clone({
                setHeaders: { Authorization: `${jwt}` }
            });
        }
        return next.handle(authReq);
    }
}