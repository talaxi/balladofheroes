import { Component } from '@angular/core';
import { MeleteActionEnum } from 'src/app/models/enums/melete-action-enum.model';
import { MeleteCell } from 'src/app/models/melete/melete-cell.model';
import { GlobalService } from 'src/app/services/global/global.service';
import { MeleteService } from 'src/app/services/minigames/melete.service';
import { MatDialog as MatDialog } from '@angular/material/dialog';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GameLoopService } from 'src/app/services/game-loop/game-loop.service';
import { MeletePagesEnum } from 'src/app/models/enums/melete-pages-enum.model';

@Component({
  selector: 'app-melete-view',
  templateUrl: './melete-view.component.html',
  styleUrls: ['./melete-view.component.css']
})
export class MeleteViewComponent {
  meleteAction = MeleteActionEnum;
  cells: MeleteCell[] = []; //page, row, column, unlocked status
  subscription: any;
  activePage: MeletePagesEnum = MeletePagesEnum.Default;

  constructor(private meleteService: MeleteService, private globalService: GlobalService, public dialog: MatDialog,
    private deviceDetectorService: DeviceDetectorService, private gameLoopService: GameLoopService) {

  }

  ngOnInit() {
    this.populateCells();
    this.subscription = this.gameLoopService.gameUpdateEvent.subscribe(async () => {
      this.checkForUnlockedCells();
    });
  }

  getActionForCell(page: number, row: number, column: number) {
    if (page === 1)
    {
      if (row === 1) {
        if (column === 1)
          return MeleteActionEnum.ReflectOnSelf;
          if (column === 2)
          return MeleteActionEnum.BreatheInDeeply;
          if (column === 3)
          return MeleteActionEnum.ReflectOnOthers;
      }
      if (row === 2) {
        if (column === 1)
          return MeleteActionEnum.FocusOnConfidence;
          if (column === 2)
          return MeleteActionEnum.FocusOnTranquility;
          if (column === 3)
          return MeleteActionEnum.FocusOnFaith;
      }
      if (row === 3) {
        if (column === 1)
          return MeleteActionEnum.PrepareForAction;
          if (column === 2)
          return MeleteActionEnum.InternalContemplation;
          if (column === 3)
          return MeleteActionEnum.PrepareForPrayer;
      }
      if (row === 4) {
        if (column === 1)
          return MeleteActionEnum.AcceptFaults;
          if (column === 2)
          return MeleteActionEnum.ExhaleDeeply;
          if (column === 3)
          return MeleteActionEnum.AcceptHelp;
      }
    }
    return MeleteActionEnum.None;
  }

  isConfidenceUnlocked() {
    return this.globalService.globalVar.melete.resources.confidenceUnlocked;
  }

  isFaithUnlocked() {
    return this.globalService.globalVar.melete.resources.faithUnlocked;
  }

  getTranquility() {
    return this.globalService.globalVar.melete.resources.tranquility;
  }

  getConfidence() {
    return this.globalService.globalVar.melete.resources.confidence;
  }

  getFaith() {
    return this.globalService.globalVar.melete.resources.faith;
  }

  populateCells() {
    this.cells = [];

    if (this.activePage === MeletePagesEnum.Default) {
      this.getDefaultPageCells();
    }
  }

  isRowDisabled(row: number) {
    var melete = this.globalService.globalVar.melete;

    if (melete.activeActions.length === 0)
      return false;

    var actionsInRow: MeleteActionEnum[] = [];
    for (var i = 1; i <= 3; i++) { //assumes a max of 3 columns
      var action = this.getActionForCell(this.activePage, row, i);
      if (action !== MeleteActionEnum.None)
        actionsInRow.push(action);
    }

    var actionFound = false;
    melete.activeActions.forEach(action => {
      if (actionsInRow.some(item => item === action[0]))
        actionFound = true;
    });

    return actionFound;
  }

  isCellUnlocked(page: number, row: number, column: number) {
    var cell = this.cells.find(item => item.page === page && item.row === row && item.column === column);

    if (cell !== undefined)
      return cell.unlocked;

    return false;
  }

  checkForUnlockedCells() {
    this.cells.forEach(cell => {
      if (!cell.unlocked)
        cell.unlocked = this.checkIfCellIsUnlocked(cell.page, cell.row, cell.column);
    });
  }

  checkIfCellIsUnlocked(page: number, row: number, column: number) {
    if (page === 1) {
      if (row === 2) {
        return this.globalService.globalVar.melete.resources.tranquility >= 20;
      }
      if (row === 3) {
        if (column === 1)
          return this.globalService.globalVar.melete.resources.confidence >= 20;
        else if (column === 2)
          return this.globalService.globalVar.melete.resources.tranquility >= 20;
        else if (column === 3)
          return this.globalService.globalVar.melete.resources.faith >= 20;
      }
      if (row === 4) {
        if (column === 1)
          return this.globalService.globalVar.melete.resources.confidence >= 50;
        else if (column === 2)
          return this.globalService.globalVar.melete.resources.tranquility >= 100;
        else if (column === 3)
          return this.globalService.globalVar.melete.resources.faith >= 50;
      }
    }

    return false;
  }

  getDefaultPageCells() {
    for (var i = 1; i <= 4; i++) {
      for (var j = 1; j <= 4; j++) {
        this.cells.push(new MeleteCell(1, i, j, this.getActionForCell(1, i, j), false));
      }
    }
  }

  openItemModal(content: any) {
    if (this.deviceDetectorService.isMobile())
      this.dialog.open(content, { width: '95%', height: '80%' });
    else
      this.dialog.open(content, { width: '75%', minHeight: '75vh', maxHeight: '75vh' });
  }

  hiddenStyle(boolValue: boolean) {
    return {
      'opacity': boolValue ? '1' : '0',
      'visibility': boolValue ? "visible" : "hidden"
    };
  }
}
