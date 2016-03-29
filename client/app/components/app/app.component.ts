import {Component, Inject} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router'

import {AboutComponent} from '../about/about.component'
import {HTTP_PROVIDERS, Http} from 'angular2/http';

@RouteConfig([
    //{path: '/', component: },
    {path: '/about', component: AboutComponent},
])
@Component({
    selector: 'my-app',
    template: `
    <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent {
}
