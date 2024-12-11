import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MockBackendInterceptor } from './app/shared/mock-backend/mock-backend.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

void bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, NgbModule),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HTTP_INTERCEPTORS, useClass: MockBackendInterceptor, multi: true }
    ]
});
