import { Type } from "class-transformer";
import { Recipe } from "./recipe.model";

export class Alchemy {
    level: number;
    exp: number;
    expToNextLevel: number;
    @Type(() => Recipe)
    availableRecipes: Recipe[];

    creatingRecipe: Recipe | undefined;
    alchemyTimer: number;
    alchemyTimerLength: number;
    alchemyStep: number;

    alchemyCurrentAmountCreated: number;
    alchemyCreateAmount: number;

    constructor() {
        this.level = 0;
        this.availableRecipes = [];

        this.alchemyTimer = 0;
        this.alchemyTimerLength = 0;
        this.alchemyStep = 0;
        this.exp = 0;
        this.expToNextLevel = 20;
        this.alchemyCurrentAmountCreated = 0;
        this.alchemyCreateAmount = 1;
    }
}
