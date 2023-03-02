import { Injectable } from '@angular/core';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class VersionControlService {

  constructor(public globalService: GlobalService) { }

  getCurrentVersion() {
    return .2;
  }
}
