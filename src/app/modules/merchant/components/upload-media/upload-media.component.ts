
import { Component, OnInit, ViewChild, EventEmitter, Input, ElementRef, Output } from '@angular/core';
import { UploadService, DocType } from 'src/app/modules/shared/services/upload.service';

@Component({
  selector: 'app-admin-upload-media',
  providers: [],
  templateUrl: './upload-media.component.html',
  styleUrls: [
    './upload-media.component.scss',
    '../../../../../page.scss'
  ]
})
export class UploadMediaComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  productId = '45fdssirfssss';
  checkedImages: any;
  @Input() images: any;
  @Input() singleFile: boolean;
  // @Output() uploaded: EventEmitter<string> = new EventEmitter();
  errMsg = '';
  successMsg = '';
  url = '';
  uploadSuccess = false;

  constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
    this.checkedImages = [];
    if (!this.images) {
      this.images = [];
    }
  }

  isChecked(image) {
    return (this.checkedImages.indexOf(image) >= 0);
  }
  FieldsChange(image, values: any) {
    const checked = values.currentTarget.checked;
    if (checked) {
      this.checkedImages.push(image);
    } else {
      this.checkedImages = this.checkedImages.filter((item) => (item !== image));
    }
  }

  deleteMedia() {
    console.log('this.images1');
    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      if (this.checkedImages.indexOf(image) >= 0) {
        this.images.splice(i, 1);
        i--;
      }
    }
    this.checkedImages = [];
  }

  fileChangeEvent(e: File[]) {
    if (!e) { return; }
    this.uploadSuccess = false;/* DXACF */
    this.url = '';
    const file = e[0];
    const fileName = file.name;
    const fileType = file.type;
    this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.productId).subscribe(
      ret => {
        const signedUrl = ret.signed_request;
        this.url = ret.url;
        this.uploadService.uploadFileToSignedUrl(signedUrl, file.type, file).subscribe(
          retn => {
            this.images.push(this.url);
            // this.uploaded.emit(this.url);

            this.successMsg = 'Uploaded'; this.uploadSuccess = true;
          },
          err => { this.errMsg = 'Error in uploading.'; });
      },
      error => this.errMsg = 'Error happened during apply presigned url.'
    );
  }
}
