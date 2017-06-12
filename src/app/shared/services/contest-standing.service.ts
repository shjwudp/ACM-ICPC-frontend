import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import { ContestStandingInterface } from '../../models';
import * as Global from '../../globals';

@Injectable()
export class ContestStandingService {

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getContestStanding(): Observable<ContestStandingInterface> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        return this.http.get(Global.apiDomain + '/api/authorized/contest-standing', options)
            .map((response: Response) => response.json() as ContestStandingInterface);
    }
}
