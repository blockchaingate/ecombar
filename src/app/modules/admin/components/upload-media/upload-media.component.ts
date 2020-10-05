import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import {HttpEventType, HttpErrorResponse} from '@angular/common/http';
import {UploadService} from '../../../shared/services/upload.service';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Component({
  selector: 'app-admin-upload-media',
  providers: [],
  templateUrl: './upload-media.component.html',
  styleUrls: [
      './upload-media.component.scss', 
      '../../../../../button.scss'
    ]
})
export class UploadMediaComponent implements OnInit{
  
  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;
  files = [];
  @Input() images: any;

  constructor(private uploadService: UploadService) { }
  ngOnInit() {

  }

  uploadFile(file) {

        const formData = new FormData();  
        formData.append('file', file.data);
        this.uploadService.upload(formData)
        .subscribe((event: any) => {
          console.log('event=', event);
            if (typeof (event) === 'object') {

              console.log(event.body);

            }  

          });  

  }

  onClick() {

        const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
        for (let index = 0; index < fileUpload.files.length; index++)

        {

         const file = fileUpload.files[index];

         this.files.push({ data: file, inProgress: false, progress: 0});

        }

          this.uploadFiles();

        };

        fileUpload.click();

    }  

    private uploadFiles() {  
      this.fileUpload.nativeElement.value = '';  
      this.files.forEach(file => {  
        this.uploadFile(file);  
      });  
  }

}