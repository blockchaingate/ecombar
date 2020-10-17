import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { TextLan } from '../models/textlan';

@Injectable({ providedIn: 'root' })
export class TextLanService {
  constructor(private http: HttpService) { }

  create(data: TextLan) {
    return this.http.post('textlans/Create', data, true);
  }

  update(id: string, data: TextLan) {
    return this.http.put('textlans/Update/' + id, data, true);
  }

  getTextLan(id: string) {
    return this.http.get('textlans/' + id);
  }

  getTextLans() {
    return this.http.get('textlans');
  }

  delete(id: string) {
    return this.http.delete('textlans/' + id, true);
  }
}