import { MeleteActionEnum } from "../enums/melete-action-enum.model";
import { MeleteResources } from "./melete-resources.model";

export class Melete {
    resources: MeleteResources;
    activeActions: [MeleteActionEnum, number][]; //action and remaining cooldown

    constructor() {
        this.resources = new MeleteResources();
        this.activeActions = [];
    }
}
