import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AuthenticationService } from '../services';
import { UserInterface } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable()
export class UserManageService {

    constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {
    }

    getAllUser(): Observable<UserInterface[]> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // get ranklist from api
        return this.http.get(environment.apiDomain + '/api/authorized/participant', options)
            .map((response: Response) => response.json() as UserInterface[]);
    }

    postUserList(file: File): Observable<number> {
        // add authorization header with jwt token
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });

        // post user.csv to api
        let apiUrl = environment.apiDomain + '/api/authorized/participant';
        let postForm: FormData = new FormData();
        postForm.append('uploadFile', file, file.name);
        return this.http.post(apiUrl, postForm, options)
            .map((response: Response) => response.json().affected);
    }
}
