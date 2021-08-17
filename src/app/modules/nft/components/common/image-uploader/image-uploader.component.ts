import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
// import { UploadService } from 'src/app/services/upload.service';
import { UploadService, DocType } from 'src/app/modules/shared/services/upload.service';

@Component({
    providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploaderComponent),
      multi: true
    }],
    selector: 'app-image-uploader',
    templateUrl: './image-uploader.component.html',
    styleUrls: ['./image-uploader.component.scss']
  })
  export class ImageUploaderComponent implements ControlValueAccessor,OnInit {
    @Input() title: string;
    @Input() subtitle: string;
    @Input() productId: string; 
    url = '';
    image: string;
    successMsg = '';
    errMsg = '';
    uploadSuccess = false;

    constructor(private uploadService: UploadService) {}

    ngOnInit() {
        //this.image = "blob:https://testnets.opensea.io/bda6b063-8f9c-495c-86d4-76260b42c86f";
          //this.image = 'https://lh3.googleusercontent.com/E_vznLJI8etM3V_AmkgNeaIFDZ1ve4v9w-IBMkU4BzgisoX4kptb3jiD0fJcJpQoNwjrEmD61sA8cWVw9GDXIN7MlvVnjkUEcGCU=w250';
    }


    fileChange(event) {
      console.log('fileChange==', event);
      let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];

          const fileName = file.name;
          const fileType = file.type;
          if(!this.productId) {
            this.productId = 'nft_' + 'pubkey';
          }
          // alert('prodid: '+this.productId);
          this.uploadService.applyPresignedUrl(fileName, fileType, DocType.PRODUCT, this.productId).subscribe(
            ret => {
              const signedUrl = ret.signed_request;
              this.url = ret.url;
              // alert('url: ' +  this.url);
              this.uploadService.uploadFileToSignedUrl(signedUrl, file.type, file).subscribe(
                retn => {
                  // this.images.push(this.url);
                  this.image = this.url;
                  this.updateChanges();
      
                  this.successMsg = 'Uploaded'; this.uploadSuccess = true;
                },
                err => { this.errMsg = 'Error in uploading.'; });
            },
            error => this.errMsg = error.message || error //'Error happened during apply presigned url.'
          );
     


         /*
          this.uploadServ.uploadFile('s3/nft/upload', file).subscribe(
            (res: any) => {
              console.log('res for upload file=', res);
              if(res && res.ok) {
                this.image = res.data;
                this.updateChanges();
              }
            });
          */
      }
    }    

    /**
     * Invoked when the model has been changed
     */
    onChange: (_: any) => void = (_: any) => {};

    /**
     * Invoked when the model has been touched
     */
    onTouched: () => void = () => {};


    /**
     * Method that is invoked on an update of a model.
     */
    updateChanges() {
        this.onChange(this.image);
    }

    ///////////////
    // OVERRIDES //
    ///////////////

    /**
     * Writes a new item to the element.
     * @param value the value
     */
    writeValue(image: string): void {
        this.image = image;
        this.updateChanges();
    }

    /**
     * Registers a callback function that should be called when the control's value changes in the UI.
     * @param fn
     */
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Registers a callback function that should be called when the control receives a blur event.
     * @param fn
     */
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

  }
