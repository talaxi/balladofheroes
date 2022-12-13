import { Type } from "class-transformer";
import { BalladEnum } from "../enums/ballad-enum.model";
import { SubZoneEnum } from "../enums/sub-zone-enum.model";
import { ZoneEnum } from "../enums/zone-enum.model";
import { Ballad } from "./ballad.model";
import { SubZone } from "./sub-zone.model";
import { Zone } from "./zone.model";

export class PlayerNavigation {
    @Type(() => SubZone)
    currentSubzone: SubZone;

    constructor() {
        
    }
}
