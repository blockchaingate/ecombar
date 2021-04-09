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
    image: string;
      ngOnInit() {
        //this.image = "blob:https://testnets.opensea.io/bda6b063-8f9c-495c-86d4-76260b42c86f";
          //this.image = 'https://lh3.googleusercontent.com/E_vznLJI8etM3V_AmkgNeaIFDZ1ve4v9w-IBMkU4BzgisoX4kptb3jiD0fJcJpQoNwjrEmD61sA8cWVw9GDXIN7MlvVnjkUEcGCU=w250';
      }
  }
