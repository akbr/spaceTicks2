import Vector from "./Vector";

export function distanceBetween(entity, entity2) {
  let x = entity2.x - entity.x;
  let y = entity2.y - entity.y;
  return Math.sqrt(x * x + y * y);
}

export function angleBetween(sprite1, sprite2) {
  let x = sprite2.x - sprite1.x;
  let y = sprite2.y - sprite1.y;
  return Math.atan2(y, x); //* 180 / Math.PI
}

export function travel(obj1, obj2, speed) {
  let begin = new Vector(obj1.x, obj1.y);
  let end = new Vector(obj2.x, obj2.y);

  return end
    .sub(begin)
    .norm()
    .mul(speed)
    .add(begin);
}
