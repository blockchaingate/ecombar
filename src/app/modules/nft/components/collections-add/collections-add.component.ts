/*
 https://testnets-api.opensea.io/graphql/

 ------WebKitFormBoundaryiW4MOggx46zA8Aha
Content-Disposition: form-data; name="operations"

{"query":"mutation CreateCollectionMutation(\n  $name: String!\n  $description: String\n  $logoImage: Upload!\n) {\n  collections {\n    create(name: $name, description: $description, logoImage: $logoImage) {\n      slug\n      id\n    }\n  }\n}\n","variables":{"name":"test collection for miri","description":"just for testing","logoImage":null}}
------WebKitFormBoundaryiW4MOggx46zA8Aha
Content-Disposition: form-data; name="map"

{"1":["variables.logoImage"]}
------WebKitFormBoundaryiW4MOggx46zA8Aha
Content-Disposition: form-data; name="1"; filename="blockchain_school_canvas_low.jpg"
Content-Type: image/jpeg


------WebKitFormBoundaryiW4MOggx46zA8Aha--



response:

{"data":{"collections":{"create":{"slug":"test-collection-for-miri","id":"Q29sbGVjdGlvblR5cGU6NDQ2ODk="}}}}
*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collections-add',
    templateUrl: './collections-add.component.html',
    styleUrls: ['./collections-add.component.scss']
  })
  export class NftCollectionsAddComponent implements OnInit {
    @Output() createEvent = new EventEmitter<any>();
    name: string;
    description: string;
    image: string;
    ngOnInit() {
      //this.image = 'https://lh3.googleusercontent.com/E_vznLJI8etM3V_AmkgNeaIFDZ1ve4v9w-IBMkU4BzgisoX4kptb3jiD0fJcJpQoNwjrEmD61sA8cWVw9GDXIN7MlvVnjkUEcGCU=w250';    
    }

    createCollection() {
        const data = {
            name: this.name,
            description: this.description,
            image: this.image
        }
        this.createEvent.emit(data);
    }
  }
