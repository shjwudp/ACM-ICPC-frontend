import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import { BallonStatusInterface } from '../../models';
import * as Global from '../../globals';

@Injectable()
export class BallonStatusService {
    ballonStatusList: BallonStatusInterface[];

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getAllBallonStatus(): Observable<BallonStatusInterface[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        let apiUrl = Global.api_domain + '/api/authorized/ballon-status';
        return this.http.request(apiUrl, options)
            .map((response: Response) => response.json() as BallonStatusInterface[]);
    }

    patchBallonStatus(
        teamKey: string,
        problemIndex: number,
        action: string): Observable<number> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // post user.csv to api
        let apiUrl = Global.api_domain + '/api/authorized/ballon-status';
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
