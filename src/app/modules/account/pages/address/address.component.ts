import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AddressService } from 'src/app/modules/shared/services/address.service';
import { Router, ActivatedRoute } from '@angular/router';

// 定义验证规则：FormBuilder 构建表单数据，FormGroup 表单类型，Validators 表单验证
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-admin-address',
    templateUrl: './address.component.html',
    styleUrls: [
        './address.component.scss',
        '../../../../../page.scss'
    ]
})
export class AddressComponent implements OnInit{
    name: string;
    suite: string;
    streetNumber: string;
    street: string;
    district: string;
    city: string;
    orderId: string;
    province: string;
    postcode: string;
    country: string;
    id: string;
    workForm: FormGroup;    // 定义表单

    // 添加 fb 属性，用来创建表单
    // constructor(private fb: FormBuilder) { }
    constructor(
        private fb: FormBuilder,  // 添加 fb 属性，用来创建表单
        private cd: ChangeDetectorRef,  // 变更检测 detectChanges()
        private userServ: UserService, 
        private addressServ: AddressService) {

    }

    ngAfterContentChecked() {    // 使用 ngAfterViewInit, ngAfterContentInit 无效
        this.cd.detectChanges();  // 变更检测 detectChanges()
    }

    ngOnInit() {
        this.userServ.getMe().subscribe(
            (res: any) => {
                console.log('resme==',res);
                if(res && res.ok) {
                    const member = res._body;
                    if(member.homeAddressId) {
                        this.id = member.homeAddressId;
                        this.addressServ.getAddress(member.homeAddressId).subscribe(
                            (res: any) => {
                                console.log('res for addressss=', res);
                                if(res && res.ok) {
                                    const address = res._body;
                                    this.name = address.name;
                                    this.suite = address.suite;
                                    this.streetNumber = address.streetNumber;
                                    this.street = address.street;
                                    this.district = address.district;
                                    this.city = address.city;
                                    this.province = address.province;
                                    this.postcode = address.postcode;
                                    this.country = address.country;                  
                                    console.log('res  for address=', res);
                                }
                            }
                        );
                    }
                }
            }
        );

        this.buildForm();    // 初始化时构建表单
    } 

    // 构建表单方法
    buildForm(): void {
        // 通过 formBuilder构建表单
        this.workForm = this.fb.group({
        name: ['', [    // 在页面上已有验证
            Validators.required,    // 必填
            Validators.minLength(3),    // 最短为 3
            // Validators.maxLength(20),    // 最长为 10
            // this.validateRex('notdown', /^(?!_)/),    // 不能以下划线开头
            // this.validateRex('only', /^[1-9a-zA-Z_]+$/),    // 只能包含数字、字母、下划线
        ]],
        // buyerPhone: ['', [
        //     Validators.required,
        //     Validators.minLength(3),
        // ]],
        suite: ['', [    // N/A
        ]],
        streetNumber: ['', [
            Validators.required,
        ]],
        street: ['', [
            Validators.required,
            Validators.minLength(3),
        ]],
        district: ['', [    // N/A
        ]],
        city: ['', [
            Validators.required,
            Validators.minLength(2),
        ]],
        province: ['', [
            Validators.required,
            Validators.minLength(2),
        ]],
        postcode: ['', [
            Validators.required,
            Validators.minLength(3),
        ]],
        country: ['', [    // N/A
        ]],
        });
    }

    isInvalid( form: any, id: string ) {
        // *ngIf="(workForm.get('name').touched || workForm.get('name').dirty) && workForm.get('name').invalid"
        return (form.get(id).touched || form.get(id).dirty) && form.get(id).invalid;  // .errors 也可
    }
    
    addAddress() {
        const address = {
            name: this.name,
            suite: this.suite,
            streetNumber: this.streetNumber,
            street: this.street,
            district: this.district,
            city: this.city,
            province: this.province,
            postcode: this.postcode,
            country: this.country
        };


        if(this.id) {
            this.addressServ.updateAddress(this.id, address).subscribe(
                (res:any) => {
                    console.log('res for updateAddress', address);
                }
        );
        } else {
        this.addressServ.addAddress(address).subscribe(
            (res:any) => {
                if(res && res._id) {
                    const addressId = res._id;
                    const body = {
                        homeAddressId: addressId
                    }
                    this.userServ.updateSelf(body).subscribe(
                        (res:any) => {
                            console.log('res for update address', res);
                        }
                    );
                }
                console.log('res for addAddress', address);
            }
        );
        }
    }
}
