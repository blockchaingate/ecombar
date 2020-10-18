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
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  productId: string;
  files = [];
  @Input() images: any;

  constructor(private uploadService: UploadService) { }

  ngOnInit() { }

  uploadFile(file: File) {
    const ret = this.uploadService.uploadFile(file, DocType.PRODUCT, this.productId);
  }

  // Upload multiple files
  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  uploadFormFile(file) {
    const formData = new FormData();
    formData.append('file', file.data);
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        this.files.push({ data: file, inProgress: false, progress: 0 });
      }
      this.uploadFiles();
    };
    fileUpload.click();
  }

}