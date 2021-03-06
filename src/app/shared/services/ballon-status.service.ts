import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import { BallonStatusInterface } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable()
export class BallonStatusService {

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getAllBallonStatus(): Observable<BallonStatusInterface[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        let apiUrl = environment.apiDomain + '/api/authorized/ballon-status';
        return this.http.request(apiUrl, options)
            .map((response: Response) => {
                if (response == null || !response.json()) {
                    return [];
                }
                return response.json() as BallonStatusInterface[];
            });
    }

    patchBallonStatus(
        teamKey: string,
        problemIndex: number,
        action: string): Observable<number> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // post user.csv to api
        let apiUrl = environment.apiDomain + '/api/authorized/ballon-status';
        let postJSON = {
            "TeamKey": teamKey,
            "ProblemIndex": problemIndex,
            "action": action,
        };
        console.log(apiUrl, postJSON, options);
        return this.http.patch(apiUrl, postJSON, options)
            .map((response: Response) => response.json().affected);
    }
}
