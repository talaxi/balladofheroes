import { MeleteActionEnum } from "../enums/melete-action-enum.model";

export class MeleteCell {
    page: number;
    row: number;
    column: number;
    unlocked: boolean;
    action: MeleteActionEnum;

    constructor(page?: number, row?: number, column?: number, action?: MeleteActionEnum, unlocked?: boolean) {
        this.page = page ?? 0;
        this.row = row ?? 0;
        this.column = column ?? 0;
        this.action = action ?? MeleteActionEnum.None;
        this.unlocked = unlocked ?? false;
    }
}
