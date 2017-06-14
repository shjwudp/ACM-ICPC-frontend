import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import { ContestInfoInterface } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ContestInfoService {

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getContestInfo(): Observable<ContestInfoInterface> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        let apiUrl = environment.apiDomain + '/api/authorized/contest-info';
        return this.http.get(apiUrl, options)
            .map((response: Response) => response.json() as ContestInfoInterface);
    }

    saveContestInfo(contestInfo: ContestInfoInterface) {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        let apiUrl = environment.apiDomain + '/api/authorized/contest-info';
        return this.http.post(apiUrl, contestInfo, options)
            .map((response: Response) => response.json());
    }
}
