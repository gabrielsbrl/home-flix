import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/services/storage.service';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  public videoInfo: any = null;

  constructor(
    private _route: ActivatedRoute, 
    private _router: Router,
    private _storageService: StorageService
  ) { }

  ngOnInit(): void {
    let identificator = this._route.snapshot.params.id;
    let context = this._storageService.getStorageData('videos');
    let videoFromContext = context.filter(c => c.identificator.toString() === identificator);
    this.videoInfo = videoFromContext[0];
    console.log('Video from context: ', this.videoInfo);
  }

  public generateVideoSrc() {
    return environment.apiV1 + '/video/stream/' + this.videoInfo.identificator;
  }

}
