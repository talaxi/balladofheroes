export class LinkInfo {
    totalLinks: number;
    remainingLinks: number;
    linkChain: number;
    bonusChain: number;
    cooldown: number;

    constructor() {
        this.totalLinks = 0;
        this.remainingLinks = 0;
        this.linkChain = 0;
        this.bonusChain = 0;
        this.cooldown = 0;
    }
}
