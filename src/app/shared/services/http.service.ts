import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ServerResponse } from '../interfaces/server-response.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class HttpService {

    constructor(private _http: HttpClient) {}

    public get(route: string) : Observable<ServerResponse> {
        return this._http.get<ServerResponse>(environment.apiV1 + route);
    }

}