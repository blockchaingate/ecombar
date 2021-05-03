import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'login-setting-modal',
    templateUrl: './login-setting.modal.html',
    styleUrls: ['./login-setting.modal.css']
})
export class LoginSettingModal implements OnInit{
    loginSettingForm: FormGroup;
    public onClose: Subject<string>;

    constructor(private modalRef: BsModalRef, private fb: FormBuilder) {

    }

    ngOnInit() {
        this.onClose = new Subject();
        this.loginSettingForm = this.fb.group({
            password: [null, [
                Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)]
            ],
            pwdconfirm: ['']
        }, { validator: this.checkPasswords });        
    }

    close() {
        this.modalRef.hide();
    }  

    checkPasswords(group: FormGroup) { // here we have the 'passwords' group
        const pass = group.controls.password.value;
        const confirmPass = group.controls.pwdconfirm.value;
        if (pass !== confirmPass) {
          return { notSame: true };
        }

        return null;
    } 

    onSubmit() {
        const password = this.loginSettingForm.controls.password.value;
        this.onClose.next(password);
        this.modalRef.hide();        
    }

}
