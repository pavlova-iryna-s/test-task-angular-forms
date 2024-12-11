import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { ICheckUserResponseData, ISubmitFormResponseData } from '../models/responses.model';

@Injectable()
export class MockBackendInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpResponse<ICheckUserResponseData | ISubmitFormResponseData>> {
        if (request.url.endsWith('/api/checkUsername') && request.method === 'POST') {
            return this.handleCheckUsername(request);
        }

        if (request.url.endsWith('/api/submitForm') && request.method === 'POST') {
            return this.handleSubmitForm(request);
        }

        return of(new HttpResponse({ status: 404, body: { result: 'You are using the wrong endpoint' } }));
    }

    private handleCheckUsername(request: HttpRequest<any>): Observable<HttpResponse<ICheckUserResponseData>> {
        const isAvailable = request.body.username.includes('new');
        const response = new HttpResponse({ status: 200, body: { isAvailable } });

        return of(response).pipe(
            delay(500),
            tap(() => console.log('checkUsername response:', { isAvailable }))
        );
    }

    private handleSubmitForm(request: HttpRequest<unknown>): Observable<HttpResponse<ISubmitFormResponseData>> {
        const response = new HttpResponse({ status: 200, body: { result: 'nice job' } });

        return of(response).pipe(
            delay(500),
            tap(() => console.log('submitForm response', request))
        );
    }
}
