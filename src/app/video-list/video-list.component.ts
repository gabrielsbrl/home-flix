import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Router} from '@angular/router';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent{

  @Input()
  public videos: Array<any> = [];

  constructor(private router: Router) { }

  getImageSrc(imageIdentificator) {
    return environment.apiV1 + '/video/thumb/' + imageIdentificator;
  } 

  navigateToPlayer(videoIdentificator) {
    this.router.navigateByUrl('/video-player/'+videoIdentificator);
  }

}
