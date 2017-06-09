import { Injectable } from '@angular/core';
import { Request, XHRBackend, RequestOptions, Response, Http, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as Global from '../../globals';

@Injectable()
export class AuthenticationService extends Http {
    public token: string;

    constructor(backend: XHRBackend, private router: Router, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(account: string, password: string): Observable<boolean> {
        return this.post(Global.api_domain + '/api/authenticate', JSON.stringify({ account: account, password: password }))
            .map((response: Response) => {
                console.log('login response:', response);
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;

                    // store account and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ account: account, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            }).catch((err: any, caught: Observable<boolean>) => {
                console.log('shjwudp', err, caught);
                if (err.status === 401) {
                    return Observable.throw('Unauthorized');
                }
                // console.error('login response:', response);
                return Observable.throw('Error');
                // do any other checking for statuses here
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((error: Response) => {
            console.log('shjwudp', error);
            if (error.status === 401 || error.status === 403) {
                console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
                this.router.navigate(['login']);
                // window.location.href = window.location.href + '?' + new Date().getMilliseconds();
            }
            return Observable.throw(error);
        })
    }

    // request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    //     return super.request(url, options).catch((error: Response) => {
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }

    // get(url: string, options?: RequestOptionsArgs) {
    //     return super.request(url, options).catch((error: Response) => {
    //         console.log("????")
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }

    // delete(url: string, options?: RequestOptionsArgs) {
    //     return super.request(url, options).catch((error: Response) => {
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }


    // post(url: string, body: any, options?: RequestOptionsArgs) {
    //     return super.request(url, options).catch((error: Response) => {
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }


    // patch(url: string, body: any, options?: RequestOptionsArgs) {
    //     return super.request(url, options).catch((error: Response) => {
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }

    // put(url: string, body: any, options?: RequestOptionsArgs) {
    //     return super.request(url, options).catch((error: Response) => {
    //         if (error.status === 401 || error.status === 403) {
    //             console.log('The authentication session expires or the user is not authorised. Force refresh of the current page.');
    //             // this.router.navigate(['logout']);
    //             window.location.href = window.location.href + '?' + new Date().getMilliseconds();
    //         }
    //         return Observable.throw(error);
    //     });
    // }
}

// @Injectable()
// export class AuthenticationService {
//     public token: string;

//     constructor(private http: Http) {
//         // set token if saved in local storage
//         var currentUser = JSON.parse(localStorage.getItem('currentUser'));
//         this.token = currentUser && currentUser.token;
//     }

//     login(account: string, password: string): Observable<boolean> {
//         return this.http.post(Global.api_domain + '/api/authenticate', JSON.stringify({ account: account, password: password }))
//             .map((response: Response) => {
//                 console.log('login response:', response);
//                 // login successful if there's a jwt token in the response
//                 let token = response.json() && response.json().token;
//                 if (token) {
//                     // set token property
//                     this.token = token;

//                     // store account and jwt token in local storage to keep user logged in between page refreshes
//                     localStorage.setItem('currentUser', JSON.stringify({ account: account, token: token }));

//                     // return true to indicate successful login
//                     return true;
//                 } else {
//                     // return false to indicate failed login
//                     return false;
//                 }
//             }).catch((err: any, caught: Observable<boolean>) => {
//                 console.log('shjwudp', err, caught);
//                 if (err.status === 401) {
//                     return Observable.throw('Unauthorized');
//                 }
//                 // console.error('login response:', response);
//                 return Observable.throw('Error');
//                 // do any other checking for statuses here
//             });
//     }

//     logout(): void {
//         // clear token remove user from local storage to log user out
//         this.token = null;
//         localStorage.removeItem('currentUser');
//     }
// }
