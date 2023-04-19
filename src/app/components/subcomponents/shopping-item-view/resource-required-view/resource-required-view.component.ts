import { Component, Input, OnInit } from '@angular/core';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { LookupService } from 'src/app/services/lookup.service';
import { DictionaryService } from 'src/app/services/utility/dictionary.service';

@Component({
  selector: 'app-resource-required-view',
  templateUrl: './resource-required-view.component.html',
  styleUrls: ['./resource-required-view.component.css']
})
export class ResourceRequiredViewComponent implements OnInit {
  @Input() resource: ResourceValue;
  @Input() isSmall: boolean = false;
  displayName = "";
  insufficientText = 0;
  showTooltip: boolean = false;
  subscription: any;

  constructor(public lookupService: LookupService, private gameLoopService: GameLoopService, public dictionaryService: DictionaryService) { }

  ngOnInit(): void {
    this.displayName = this.dictionaryService.getItemName(this.resource.item);
    var userResourceAmount = this.lookupService.getResourceAmount(this.resource.item);
    this.insufficientText = userResourceAmount;

    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {      
      var userResourceAmount = this.lookupService.getResourceAmount(this.resource.item);
      this.insufficientText = userResourceAmount;
    });
  }


  getItemKeywordClass(amountNeeded: number) {    
    var userResourceAmount = this.lookupService.getResourceAmount(this.resource.item);
    var classText = "resourceKeyword";

    if (userResourceAmount < amountNeeded)
      classText = "insufficientResourcesKeyword";

    return classText;
  }

  ngOnDestroy() {
    if (this.subscription !== undefined)
      this.subscription.unsubscribe();
  }
}
