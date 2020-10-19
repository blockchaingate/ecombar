import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { UploadService, DocType } from '../../../shared/services/upload.service';

@Component({
  selector: 'app-admin-upload-media',
  providers: [],
  templateUrl: './upload-media.component.html',
  styleUrls: [
    './upload-media.component.scss',
    '../../../../../button.scss'
  ]
})
export class UploadMediaComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  productId = '45fdssirfssss';
  files = [];
  @Input() images: any;
  errMsg = '';
  successMsg = '';
  url = '';
  uploadSuccess = false;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void { }

  uploadFile(file: File): void {
    const ret = this.uploadService.uploadFile(file, DocType.PRODUCT, this.productId);
  }

  // Upload multiple files
  private uploadFiles(): void {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  uploadFormFile(file): void {
    const formData = new FormData();
    formData.append('file', file.data);
  }

  fileChangeEvent(e: File[]) {
    if (!e) { return; }
    this.uploadSuccess = false;
    this.url = '';
    const file = e[0];
    const fileName = file.name;
    const fileType = file.type;
    this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.productId).subscribe(
      ret => {
        const signedUrl = ret.signed_request;
        this.url = ret.url;
        this.uploadService.uploadFileToSignedUrl(signedUrl, file.type, file).subscribe(
          retn => { this.successMsg = 'Uploaded'; this.uploadSuccess = true; },
          err => { this.errMsg = 'Error in uploading.'; });
      },
      error => this.errMsg = 'Error happened during apply presigned url.'
    );
  }

  onClick(): void {
    const fileload = this.fileUpload.nativeElement;
    alert('ddd: ' + JSON.stringify(fileload));
    alert('file cound: ' + fileload.files.length)
    fileload.onchange = () => {

      for (const ff of fileload.files) {
        this.files.push({ data: ff, inProgress: false, progress: 0 });
      }
      /*
      for (let i = 0; i < fileload.files.length; i++) {
        this.files.push({ data: fileload.files[i], inProgress: false, progress: 0 });
      }
      */
      /*
            fileload.files.forEach(file => {
              this.files.push({ data: file, inProgress: false, progress: 0 });
            });
            */
      this.uploadFiles();
    };
    fileload.click();
  }

}