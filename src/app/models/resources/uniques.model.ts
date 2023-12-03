import { ItemsEnum } from "../enums/items-enum.model";

export class Uniques {
    type: ItemsEnum;
    level: number;
    xp: number;
    xpToNextLevel: number;

    constructor(type: ItemsEnum) {
        this.type = type;
        this.level = 0;
        this.xp = 0;
        this.xpToNextLevel = 10;
    }

    getMinorEffectLevel() {
        //if (this.level === 0)
          //  return 1;

        if (Math.ceil((this.level+1) / 10) > 100)
            return 100;
        return Math.ceil((this.level+1) / 10);
    }
    
    getMajorEffectLevel() {
        //if (this.level === 0)
        //return 1;

        if (Math.ceil((this.level+1) / 100) > 10)
            return 10;
        return Math.ceil((this.level +1) / 100);
    }
}
