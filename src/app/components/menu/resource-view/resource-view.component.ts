import { Component, OnInit } from '@angular/core';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { LookupService } from 'src/app/services/lookup.service';

@Component({
  selector: 'app-resource-view',
  templateUrl: './resource-view.component.html',
  styleUrls: ['./resource-view.component.css']
})
export class ResourceViewComponent implements OnInit {
  resources: ResourceValue[];

  constructor(public lookupService: LookupService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.resources = this.globalService.globalVar.resources;
  }

}
