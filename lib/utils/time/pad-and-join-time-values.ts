export function padAndJoinTimeValues(...args: number[]) {
  return args.map(unit => unit.toString().padStart(2, '0')).join(':')
}
