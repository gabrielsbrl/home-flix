import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { VideoPlayerComponent } from './video-player/video-player.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    { 
        //validate if the user is logged in to dont show this route content
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'video-player/:id',
        component: VideoPlayerComponent
    }
];

@NgModule({
    imports: [ 
        //Caso seja necessario, basta ativar o hash para poder trabalhar com roteamento
        //em qualquer servidor -> RouterModule.forRoot(routes, { useHash: true });
        RouterModule.forRoot(routes) 
    ],
    exports: [ RouterModule ]
})
export class AppRoutingModule { }