import { Type } from "class-transformer";
import { AltarEffect } from "./altar-effect.model";
import { AltarInfo } from "./altar-info.model";

export class Altars {
    isUnlocked: boolean;
    largeAltarsUnlocked: boolean;
    pyresUnlocked: boolean;
    showNewNotification: boolean;
    @Type(() => AltarInfo)
    altar1: AltarInfo | undefined;
    @Type(() => AltarInfo)
    altar2: AltarInfo | undefined;
    @Type(() => AltarInfo)
    altar3: AltarInfo | undefined;

    @Type(() => AltarEffect)
    activeAltarEffect1: AltarEffect | undefined;
    @Type(() => AltarEffect)
    activeAltarEffect2: AltarEffect | undefined;
    @Type(() => AltarEffect)
    activeAltarEffect3: AltarEffect | undefined;

    constructor() {
        this.isUnlocked = false;
        this.showNewNotification = false;
        this.largeAltarsUnlocked = false;
        this.pyresUnlocked = false;
    }
}
