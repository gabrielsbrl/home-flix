import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../shared/services/storage.service';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { TimeHelper } from '../shared/helpers/time.helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit {

  @ViewChild('videoElement') public vElement;
  @ViewChild('videoProgressBar') public videoProgressBarElement;
  @ViewChild('volumeBar') public volumeBar;

  public videoInfo: any = null;
  public videoIsPlaying: boolean = false;
  public videoDuration: number = 0;
  public videoCurrentTime: number = 0;
  public videoCanPlay: boolean = false;
  public videoProgressRangeStep: number = .0000001;
  public videoProgressBarMin: number = 0;
  public videoVolume: number = 1;
  public videoIsMuted: boolean = false;
  public showVolumeSlider: boolean;
  public videoApiResourse: string = '/video/stream/';
  public videoPlayerPromise: Promise<any> = Promise.resolve();
  public videoHasStarted: boolean = false;
  public videoNewTimePosition: number = 0;
  public videoSrc: string = '';
  public videoHasMultipleAudioTracks: boolean = false;

  constructor(
    private _route: ActivatedRoute, 
    private _storageService: StorageService,
    private _locationService: Location,
    private _timeHelper: TimeHelper,
    private _router: Router
  ) { }

  ngOnInit(): void {    
    this.setupVideoPlayer();
  }

  ngAfterViewInit() { 
    this.loadVideo();
  }

  public setupVideoPlayer() {
    let identificator = this._route.snapshot.params.id;
    let context = this._storageService.getStorageData('videos');
    let videoFromContext = context.filter(c => c.identificator.toString() === identificator);
    this.videoInfo = videoFromContext[0];
    this.videoSrc = environment.apiV1 + this.videoApiResourse + this.videoInfo.identificator;    
    
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      console.log('Accessing via smartphone');
    }    
  }

  public hasMultipleAudioTracks() {
    if(this.vElement.nativeElement.audioTracks) {
      if(this.vElement.nativeElement.audioTracks.length > 1) {
        this.videoHasMultipleAudioTracks = true;
      } else {
        this.videoHasMultipleAudioTracks = false;
      }
    } else {
      this.videoHasMultipleAudioTracks = false
    }
  }

  public changeAudioTrack() {    
    if(this.vElement.nativeElement.audioTracks) {
      if(this.vElement.nativeElement.audioTracks.length > 1) {
        for(let i = 0; i < this.vElement.nativeElement.audioTracks.length; i++) {
          this.vElement.nativeElement.audioTracks[i].enabled = this.vElement.nativeElement.audioTracks[i].enabled ? false : true;          
        }        
        this.videoCurrentTime -= 1;
        this.setVideoNewTime();
        if(this.vElement.nativeElement.paused) {
          this.videoPlayerPromise 
            .then(() => this.vElement.nativeElement.pause())
            .catch(err => console.log('error on pause: ', err));
        } else {
          this.vElement.nativeElement.play()
            .then(() => {
              this.videoIsPlaying = true;
            })
            .catch(err => {
              this.videoIsPlaying = false;
              console.log('Error: ', err);
            });          
        } 
      }       
    }
  }

  public getCurrentVolume() {
    return (this.videoVolume * 100) + '%';
  }

  public setVideoNewVolume(event) {
    let videoNewVolume = (event.offsetX / this.volumeBar.nativeElement.offsetWidth);
    console.log(videoNewVolume);
  }

  public requestFullScreen() {
    this.vElement.nativeElement.requestFullscreen()
      .then(response => console.log('fullscreen: ', response))
      .catch(error => console.log('error: ', error));
  }

  public getVideoTimeParsed(time: number) {
    return this._timeHelper.secondsToHMS(time);
  }

  public setVideoNewTime() {
    this.vElement.nativeElement.currentTime = this.videoCurrentTime;
  }
  public changeVideoCurrentTime(event) {
    let videoNewTime = (event.offsetX / this.videoProgressBarElement.nativeElement.offsetWidth) * this.videoDuration;
    this.videoCurrentTime = videoNewTime
    this.vElement.nativeElement.currentTime = videoNewTime;
  }

  public getFutureNewTimePosition(event) {
    let videoNewTimeAsPercentage = (event.offsetX / this.videoProgressBarElement.nativeElement.offsetWidth) * 100;
    this.videoNewTimePosition = videoNewTimeAsPercentage;
  }

  public canPlay(event) {
    console.log('The video can be played');
    if(this.videoHasStarted) {
      if(this.videoIsPlaying) {
        this.playVideo();
        this.hasMultipleAudioTracks();
      }
    } else {
      this.videoHasStarted = true;
      this.setVideoIsMuted();
      this.videoCanPlay = true;
      this.videoCurrentTime = 0;    
      this.videoDuration = Number(event.target.duration);
      this.playVideo();
      this.hasMultipleAudioTracks();
    }
    this.videoVolume = 0.5;
    this.vElement.nativeElement.volume = this.videoVolume;
    console.log(this.videoVolume);
  }

  public updateProgressBar(event) {
    this.videoCurrentTime = Number(event.target.currentTime);
  }

  public playVideo() {
    this.videoIsPlaying = true;
    if(this.vElement.nativeElement.paused) {
      this.videoPlayerPromise = this.vElement.nativeElement.play();
    }
  }

  public pauseVideo() {
    this.videoIsPlaying = this.vElement.nativeElement.paused;
    if(!this.vElement.nativeElement.paused) {
      this.videoPlayerPromise.then(() => {
        this.vElement.nativeElement.pause();
        this.videoIsPlaying = false;
      })
      .catch(error => {
        this.videoIsPlaying = true;
        console.log('Error while trying to pause video: ', error.message);
      })
    }
  } 

  public changeVideoPlayingState() {
    if(this.videoIsPlaying) {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  public setVideoIsMuted() {
    this.videoIsMuted = parseInt(this.vElement.nativeElement.volume) === 0 ? true : false;
  }

  public shouldShowVolumeSlider(shouldShow: boolean) {
    this.showVolumeSlider = shouldShow;
  }

  public changeVideoVolumeState() {    
    if(this.videoIsMuted) {
      this.vElement.nativeElement.volume = 1;
    } else {
      this.vElement.nativeElement.volume = 0;
    }
    this.setVideoIsMuted();
  }

  public goBack() {
    this._locationService.back(); 
  }

  public getVideoCurrentTimeProgressBar() {
    return ((this.videoCurrentTime / this.videoDuration) * 100) + "%";
  }

  public getVideoNewTime() {
    return this.videoNewTimePosition + "%";
  }

  public clearVideoNewTime() {
    this.videoNewTimePosition = 0;
    return this.videoNewTimePosition + '%';
  }

  public loadVideo() {
    this.vElement.nativeElement.load();
  }

  public resetVideoPlayer() {
    this.videoCurrentTime = 0;
    this.videoDuration = 0;
    this.videoPlayerPromise = Promise.resolve();
    this.videoIsPlaying = false;
    this.videoIsMuted = false;
    this.videoHasStarted = false;
  }

  public playNextVideo() {    
    this.loadVideo();
    this.hasMultipleAudioTracks();
    this.playVideo();
  }

  public videoEnded(event) {
    console.log("The video has ended");
    let videosFromContext = this._storageService.getStorageData('videos');
    let nextVideoIndex = null;

    videosFromContext.forEach((video, index) => {      
      let identificatorComparison = video.identificator == this.videoInfo.identificator;
      if(identificatorComparison) {
        nextVideoIndex = index + 1;
      }
    });

    let hasNextVideo = videosFromContext.length > nextVideoIndex

    if(hasNextVideo) {
      this.videoInfo = videosFromContext[nextVideoIndex];
      this._router.navigateByUrl('/video-player/' + this.videoInfo.identificator);
      this.videoSrc = environment.apiV1 + this.videoApiResourse + this.videoInfo.identificator;
      
      this.playNextVideo();
      console.log('has next video: ', this.videoInfo);
    } else {
      this._router.navigateByUrl('/home');
      console.log('doesn`t have a next video');
    }
  }

}
