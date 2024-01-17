import { EnemyTeam } from "../character/enemy-team.model";
import { Type } from "class-transformer";

export class CompetitionParty {
    @Type(() => EnemyTeam)
    party: EnemyTeam;

    constructor() {
        this.party = new EnemyTeam();
    }
}
