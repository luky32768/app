import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private service: AuthService, 
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.service.getAuthorizationToken();
        token = token.length ? token : '';
        
        if (this.service.isLoggedIn) {
            if (token === '') {
                this.service.logout();
                this.router.navigate(['/signin']);
                console.log('session has expired');
                return next.handle(request);
            }
            else {
                let clonedHeaders = request.headers.set('Authorization',
                'Bearer ' + token);
                console.log('session continues');
                let clonedReq = request.clone({ headers: clonedHeaders });
                return next.handle(clonedReq);
            }
        }
        return next.handle(request);
    }
}
