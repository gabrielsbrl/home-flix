import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  public videoName = '';
  public apiUrl = 'http://192.168.0.33:3000/videos/';
  public videoUrl = '';
  public videoInfo: any = null;

  constructor(
    private _route: ActivatedRoute, 
    private _router: Router,
    private _storageService: StorageService
  ) { }

  ngOnInit(): void {
    let identificator = this._route.snapshot.params.id;
    this.videoUrl = this.apiUrl + identificator;
    let context = this._storageService.getStorageData('videos');
    let video = context.filter(c => c.identificator.toString() === identificator.toString());
    if(video) {
      this.videoInfo = video[0];
    }
  }

}
