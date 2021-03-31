import { Component, OnInit, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss']
  })
  export class ImageUploaderComponent implements OnInit {
    @Input() title: string;
    @Input() subtitle: string;
      ngOnInit() {
          
      }
  }
