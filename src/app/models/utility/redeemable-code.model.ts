import { ResourceValue } from "../resources/resource-value.model";
import { Type } from "class-transformer";

export class RedeemableCode {
    @Type(() => Date)
    expirationDate: Date;
    codeValue: string;
    @Type(() => ResourceValue)
    rewards: ResourceValue[];

    constructor() {
        this.rewards = [];
    }
}
