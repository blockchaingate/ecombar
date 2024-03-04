
import { Component, OnInit, ViewChild, EventEmitter, Input, ElementRef, Output } from '@angular/core';
import { ImageCroppedEvent, base64ToFile, LoadedImage } from 'ngx-image-cropper';    // "ngx-image-cropper": "^5.0.0"
import { UploadService, DocType } from 'src/app/modules/shared/services/upload.service';

@Component({
    selector: 'app-admin-image-cropper',
    providers: [],
    templateUrl: './image-cropper.component.html',
    styleUrls: [
        './image-cropper.component.scss',
        '../../../../../page.scss'
    ]
})
export class ImageCropperComponent implements OnInit {
    @ViewChild('fileInput') fileInput: ElementRef;
    @Input() images: any;
    @Output() imagesChange: EventEmitter<any> = new EventEmitter<any>();
    imageChangedEvent: any = '';
    croppedImage: any = '';
    doneFlag: boolean = true;
    uploadSuccess = false;
    productId = '45fdssirfssss';
    fileName = '';
    errMsg = '';
    successMsg = '';
    url = '';

    constructor(
        private uploadService: UploadService) { 
    }

    ngOnInit(): void {
    }

    onSelectFile() {
        // 获取文件选择器的引用
        const fileInput = this.fileInput.nativeElement;
        
        // 通过编程方式触发点击事件
        fileInput.click();
        this.doneFlag = false;
    }

    onFileChange( event: any ): void {
        this.imageChangedEvent = event;
        // 获取文件名
        const inputElement = event.target as HTMLInputElement;
        const files = inputElement.files;
        if (files && files.length > 0) {
          const file = files[0];
          this.fileName = file.name;
        }
    }

    imageCropped( e: ImageCroppedEvent ) {
        this.croppedImage = e.base64;
    }

    imageLoaded() {  // show cropper
    }

    cropperReady() {  // cropper ready
    }
    
    loadImageFailed() {  // show message
    }

    onFinish() {  // 剪切完成
        this.doneFlag = true;
        // this.croppedImage 就是结果 
        const blob  = base64ToFile(this.croppedImage);
        const file = new File([blob], this.fileName, { type: blob.type });

        this.uploadSuccess = false;  /* DXACF */
        this.url = '';
        const fileName = this.fileName;
        const fileType = file.type;
        this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.productId).subscribe(
          ret => {
            const signedUrl = ret.signed_request;
            this.url = ret.url;
            this.uploadService.uploadFileToSignedUrl(signedUrl, file.type, file).subscribe(
              retn => {
                // this.images.push(this.url);
                this.images = [ this.url ];
                // this.uploaded.emit(this.url);
                this.imagesChange.emit(this.images)
                this.successMsg = 'Uploaded'; this.uploadSuccess = true;
              },
              err => { this.errMsg = 'Error in uploading.'; });
          },
          error => this.errMsg = 'Error happened during apply presigned url.'
        );
    }

}
