import { Component } from '@angular/core';

import { UsersFormComponent } from './feature-users/components/users-form/users-form.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [UsersFormComponent]
})
export class AppComponent {}
