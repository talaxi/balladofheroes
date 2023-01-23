import { Injectable } from '@angular/core';
import { ItemTypeEnum } from 'src/app/models/enums/item-type-enum.model';
import { ItemsEnum } from 'src/app/models/enums/items-enum.model';
import { ResourceValue } from 'src/app/models/resources/resource-value.model';
import { GlobalService } from '../global/global.service';

@Injectable({
  providedIn: 'root'
})
export class ResourceGeneratorService {

  constructor(private globalService: GlobalService) { }

  getResourceFromItemType(type: ItemsEnum, amount: number) {
    //swords
    if (type === ItemsEnum.IronSword)
    {
      return new ResourceValue(ItemsEnum.IronSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeSword)
    {
      return new ResourceValue(ItemsEnum.BronzeSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeSword)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelSword)
    {
      return new ResourceValue(ItemsEnum.SteelSword, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.GoldenSword)
    {
      return new ResourceValue(ItemsEnum.GoldenSword, ItemTypeEnum.Equipment, amount);
    }

    //hammers
    if (type === ItemsEnum.IronHammer)
    {
      return new ResourceValue(ItemsEnum.IronHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeHammer)
    {
      return new ResourceValue(ItemsEnum.BronzeHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeHammer)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelHammer)
    {
      return new ResourceValue(ItemsEnum.SteelHammer, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.DiamondHammer)
    {
      return new ResourceValue(ItemsEnum.DiamondHammer, ItemTypeEnum.Equipment, amount);
    }

    //bows
    if (type === ItemsEnum.ShortBow)
    {
      return new ResourceValue(ItemsEnum.ShortBow, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.LongBow)
    {
      return new ResourceValue(ItemsEnum.LongBow, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Venomstrike)
    {
      return new ResourceValue(ItemsEnum.Venomstrike, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Wolfsbane)
    {
      return new ResourceValue(ItemsEnum.Wolfsbane, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.EagleEye)
    {
      return new ResourceValue(ItemsEnum.EagleEye, ItemTypeEnum.Equipment, amount);
    }

    //shields
    if (type === ItemsEnum.IronShield)
    {
      return new ResourceValue(ItemsEnum.IronShield, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeShield)
    {
      return new ResourceValue(ItemsEnum.BronzeShield, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.Aegis)
    {
      return new ResourceValue(ItemsEnum.Aegis, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.MoltenShield)
    {
      return new ResourceValue(ItemsEnum.MoltenShield, ItemTypeEnum.Equipment, amount);
    }

    //armor
    if (type === ItemsEnum.LinenArmor)
    {
      return new ResourceValue(ItemsEnum.LinenArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.IronArmor)
    {
      return new ResourceValue(ItemsEnum.IronArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.BronzeArmor)
    {
      return new ResourceValue(ItemsEnum.BronzeArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.FortifiedBronzeArmor)
    {
      return new ResourceValue(ItemsEnum.FortifiedBronzeArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.SteelArmor)
    {
      return new ResourceValue(ItemsEnum.SteelArmor, ItemTypeEnum.Equipment, amount);
    }
    if (type === ItemsEnum.MoltenArmor)
    {
      return new ResourceValue(ItemsEnum.MoltenArmor, ItemTypeEnum.Equipment, amount);
    }

    //necklace
    if (type === ItemsEnum.ForgottenLocket)
    {
      return new ResourceValue(ItemsEnum.ForgottenLocket, ItemTypeEnum.Equipment, amount);
    }

    //rings
    if (type === ItemsEnum.MoltenRing)
    {
      return new ResourceValue(ItemsEnum.MoltenRing, ItemTypeEnum.Equipment, amount);
    }

    //equippables
    if (type === ItemsEnum.HealingHerb)
    {
      return new ResourceValue(ItemsEnum.HealingHerb, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.HealingPoultice)
    {
      return new ResourceValue(ItemsEnum.HealingPoultice, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.HealingSalve)
    {
      return new ResourceValue(ItemsEnum.HealingSalve, ItemTypeEnum.HealingItem, amount);
    }
    if (type === ItemsEnum.ThrowingStone)
    {
      return new ResourceValue(ItemsEnum.ThrowingStone, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonFang)
    {
      return new ResourceValue(ItemsEnum.PoisonFang, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonousToxin)
    {
      return new ResourceValue(ItemsEnum.PoisonousToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.DebilitatingToxin)
    {
      return new ResourceValue(ItemsEnum.DebilitatingToxin, ItemTypeEnum.Toxin, amount);
    }
    if (type === ItemsEnum.ExplodingPotion)
    {
      return new ResourceValue(ItemsEnum.ExplodingPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.FirePotion)
    {
      return new ResourceValue(ItemsEnum.FirePotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.StranglingGasPotion)
    {
      return new ResourceValue(ItemsEnum.StranglingGasPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.PoisonExtractPotion)
    {
      return new ResourceValue(ItemsEnum.PoisonExtractPotion, ItemTypeEnum.BattleItem, amount);
    }
    if (type === ItemsEnum.HeroicElixir)
    {
      return new ResourceValue(ItemsEnum.HeroicElixir, ItemTypeEnum.Elixir, amount);
    }

    //materials
    if (type === ItemsEnum.Wax)
    {
      return new ResourceValue(ItemsEnum.Wax, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Fennel) 
    {
      return new ResourceValue(ItemsEnum.Fennel, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Olive)
    {
      return new ResourceValue(ItemsEnum.Olive, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.Asphodelus)
    {
      return new ResourceValue(ItemsEnum.Asphodelus, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.VialOfTheLethe)
    {
      return new ResourceValue(ItemsEnum.VialOfTheLethe, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.EssenceOfFire)
    {
      return new ResourceValue(ItemsEnum.EssenceOfFire, ItemTypeEnum.CraftingMaterial, amount);
    }
    if (type === ItemsEnum.SoulSpark)
    {
      return new ResourceValue(ItemsEnum.SoulSpark, ItemTypeEnum.CraftingMaterial, amount);
    }

    //charms
    if (type === ItemsEnum.SmallCharmOfDetermination)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfDetermination, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfDetermination)
    {
      return new ResourceValue(ItemsEnum.LargeCharmOfDetermination, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.SmallCharmOfRejuvenation)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfRejuvenation)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfRejuvenation, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.SmallCharmOfVulnerability)
    {
      return new ResourceValue(ItemsEnum.SmallCharmOfVulnerability, ItemTypeEnum.Charm, amount);
    }
    if (type === ItemsEnum.LargeCharmOfVulnerability)
    {
      return new ResourceValue(ItemsEnum.LargeCharmOfVulnerability, ItemTypeEnum.Charm, amount);
    }

    return new ResourceValue(ItemsEnum.None, ItemTypeEnum.None, 0);
  }
}
