type TakeFirstChar<T extends string, Default extends string> = T extends `${infer H}${infer Rest}` ? [H, Rest] : [Default, ''];

type TakeFirstChars<Strings extends string[], Default extends string> =
  Strings extends [infer H, ...infer Rest]
    ? [TakeFirstChar<H extends string ? H : never, Default>, ...TakeFirstChars<Rest extends string[] ? Rest : never, Default>] : [];

type TuplesToArrays<T extends [unknown, unknown][]> = [
  {
    [K in keyof T]: T[K] extends [infer E1, unknown] ? E1 : never;
  },
  {
    [K in keyof T]: T[K] extends [unknown, infer E2] ? E2 : never;
  }
];

type Concat<T extends string[]> = T extends [infer Head, ...infer Tail] ? `${Head & string}${Concat<Tail extends string[] ? Tail : []>}` : '';

type AlternateRec<T extends string[], R extends string[], Default extends string = ' '> = TuplesToArrays<TakeFirstChars<T, Default>> extends [infer H, infer Rest] ?
  H extends string[] ?
    Rest extends ''[] ? [...R, Concat<H>] :
      AlternateRec<Rest extends string[] ? Rest : never, [...R, Concat<H>], Default> :
    R :
  R;

type AlternateStrings<T extends string[]> = Concat<AlternateRec<T, []>>

const test1: AlternateStrings<['abc', '123', 'xyz']> = 'a1xb2yc3z';
// @ts-expect-error-next-line
const test1f: AlternateStrings<['abc', '123', 'xyz']> = 'not a1xb2yc3z';

const test2: AlternateStrings<['abc', '1']> = 'a1b c ';
// @ts-expect-error-next-line
const test2f: AlternateStrings<['abc', '1']> = 'not';

const test3: AlternateStrings<['abcd', '12', 'x']> = 'a1xb2 c  d  ';
// @ts-expect-error-next-line
const test3f: AlternateStrings<['abcd', '12', 'x']> = 'not';

const test4: AlternateStrings<['ab', '1234']> = 'a1b2 3 4';
// @ts-expect-error-next-line
const test4f: AlternateStrings<['ab', '1234']> = 'not a1b2 3 4';

