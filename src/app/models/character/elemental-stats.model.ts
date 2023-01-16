import { ElementalTypeEnum } from "../enums/elemental-type-enum.model";

export class ElementalStats {
    holy: number;
    fire: number;
    lightning: number;
    earth: number;
    air: number;
    water: number;

    constructor() {
        this.holy = 0;
        this.fire = 0;
        this.lightning = 0;
        this.earth = 0;
        this.air = 0;
        this.water = 0;
    }

    getStatByEnum(type: ElementalTypeEnum) {
        if (type === ElementalTypeEnum.Holy)
            return this.holy;
        if (type === ElementalTypeEnum.Fire)
            return this.fire;
        if (type === ElementalTypeEnum.Lightning)
            return this.lightning;
        if (type === ElementalTypeEnum.Earth)
            return this.earth;
        if (type === ElementalTypeEnum.Air)
            return this.air;
        if (type === ElementalTypeEnum.Water)
            return this.water;
        
        return 0;
    }

    increaseByStatArray(stats: ElementalStats)
    {
        this.holy += stats.holy;
        this.fire += stats.fire;
        this.lightning += stats.lightning;
        this.earth += stats.earth;
        this.air += stats.air;
        this.water += stats.water;
    }
}
