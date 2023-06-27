export enum EffectTriggerEnum {
  None,
  AlwaysActive,
  ChanceOnAutoAttack,
  OnAutoAttack,
  OnAbilityUse,
  OnHit, //auto attack or ability  ,
  TriggersEvery, //triggers every X seconds,
  ChanceOnAbilityUse,
  ChanceWhenDamageTaken,
  ChanceOnCriticalHit,
  ChanceOnHeal,
  ChanceOnDotTick,
  ChanceOnDebuff,
  WhenEnteringBattle
}