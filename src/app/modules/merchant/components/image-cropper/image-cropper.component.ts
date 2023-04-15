
import { Component, OnInit, ViewChild, EventEmitter, Input, ElementRef, Output } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';    // "ngx-image-cropper": "^5.0.0"

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
    imageChangedEvent: any = '';
    croppedImage: any = '';
    doneFlag: boolean = true;

    constructor() { 
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


    }

}
