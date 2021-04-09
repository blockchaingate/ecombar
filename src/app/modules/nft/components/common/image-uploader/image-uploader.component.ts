import { Component, OnInit, Input, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import { UploadService } from '../../../services/upload.service';

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
    image: string;

    constructor(private uploadServ: UploadService) {

    }

    ngOnInit() {
        //this.image = "blob:https://testnets.opensea.io/bda6b063-8f9c-495c-86d4-76260b42c86f";
          //this.image = 'https://lh3.googleusercontent.com/E_vznLJI8etM3V_AmkgNeaIFDZ1ve4v9w-IBMkU4BzgisoX4kptb3jiD0fJcJpQoNwjrEmD61sA8cWVw9GDXIN7MlvVnjkUEcGCU=w250';
    }


    fileChange(event) {
      console.log('fileChange==', event);
      let fileList: FileList = event.target.files;
      if(fileList.length > 0) {
          let file: File = fileList[0];
          this.uploadServ.uploadFile('s3/nft/upload', file).subscribe(
            (res: any) => {
              console.log('res for upload file=', res);
              if(res && res.ok) {
                this.image = res.data;
                this.updateChanges();
              }
            }
          );
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
