import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import * as Global from '../../globals';

@Injectable()
export class PrinterService {

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    postPrinter(printContent: string): Observable<any> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // post PrintContent from api
        let apiUrl = Global.apiDomain + '/api/authorized/printer';
        let postJson = { "PrintContent": printContent };
        return this.http.post(apiUrl, postJson, options)
            .map((response: Response) => response.json());
    }
}
