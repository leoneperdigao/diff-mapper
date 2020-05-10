# diff-mapper

diff-mapper is a JavaScript vanilla module for mapping differences between objects.

[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)

![Coverage lines](https://raw.githubusercontent.com/leoneperdigao/diff-mapper/8505f097365b266d5c583652fa149ffe0cf4cc02/.badges/badge-lines.svg)
![Coverage functions](https://raw.githubusercontent.com/leoneperdigao/diff-mapper/8505f097365b266d5c583652fa149ffe0cf4cc02/.badges/badge-functions.svg)
![Coverage branches](https://raw.githubusercontent.com/leoneperdigao/diff-mapper/8505f097365b266d5c583652fa149ffe0cf4cc02/.badges/badge-branches.svg)
![Coverage statements](https://raw.githubusercontent.com/leoneperdigao/diff-mapper/8505f097365b266d5c583652fa149ffe0cf4cc02/.badges/badge-statements.svg)

## Installation

Use the package manager [npm](https://www.npmjs.com/get-npm) to install diff-mapper.

```bash
npm i diff-mapper
```
## Usage

```typescript
import diffMapper, { DiffMapResult, ValueDiffType } from 'diff-mapper';

const object1 = { a: 1 };
const object2 = { a: 1 };
const diff = diffMapper.map(object1, object2);
console.info(diff);
{ a: { type: 'UNCHANGED', currentValue: 1, newValue: 1 } }
```

## Examples

#### 1 - Simple object diff, unchanged property
```typescript
const object1 = { a: 1 };
const object2 = { a: 1 };
const diff = diffMapper.map(object1, object2);
console.info(diff);
{ a: { type: 'UNCHANGED', currentValue: 1, newValue: 1 } }
```

#### 2 - Simple object diff, added property and removed other
```typescript
const object1 = { a: 1 };
const object2 = { b: 1 };
const diff = diffMapper.map(object1, object2);
console.info(diff);
{
  a: { type: 'DELETED', currentValue: 1, newValue: undefined },
  b: { type: 'CREATED', currentValue: undefined, newValue: 1 }
}
```

#### 3 - Nested objects, supporting changing types
```typescript
import diffMapper, { DiffMapResult, ValueDiffType } from 'diff-mapper';

const object1 = {
  a: 'i am unchanged',
  b: 'i am deleted',
  e: {
    a: 1,
    b: false,
    c: null,
  },
  f: [1, {
    a: 'same',
    b: [{
      a: 'same',
    }, {
      d: 'delete',
    }],
  }],
  g: new Date('2020.05.04'),
};

const object2 = {
  a: 'i am unchanged',
  c: 'i am created',
  e: { a: '1', b: '', d: 'created' },
  f: [{
    a: 'same',
    b: [{ a: 'same' }, { c: 'create' }],
  }, 1],
  g: new Date('2020.05.04'),
};

const diff = diffMapper.map(object1, object2);
console.info(diff);
{
      a: {
        type: 'UNCHANGED',
        currentValue: 'i am unchanged',
        newValue: 'i am unchanged',
      },
      b: {
        type: 'DELETED',
        currentValue: 'i am deleted',
        newValue: undefined,
      },
      c: {
        type: 'CREATED',
        currentValue: undefined,
        newValue: 'i am created',
      },
      e: {
        a: {
          type: 'UPDATED',
          currentValue: 1,
          newValue: '1',
        },
        b: {
          type: 'UPDATED',
          currentValue: false,
          newValue: '',
        },
        c: {
          type: 'DELETED',
          currentValue: null,
          newValue: undefined,
        },
        d: {
          type: 'CREATED',
          currentValue: undefined,
          newValue: 'created',
        },
      },
      f: {
        0: {
          type: 'UPDATED',
          currentValue: 1,
          newValue: {
            a: 'same',
            b: [{ a: 'same' }, { c: 'create' }],
          },
        },
        1: {
          type: 'UPDATED',
          currentValue: {
            a: 'same',
            b: [{ a: 'same' }, { d: 'delete' }],
          },
          newValue: 1,
        },
      },
      g: {
        type: 'UNCHANGED',
        currentValue: new Date('2020.05.04'),
        newValue: new Date('2020.05.04'),
      },
    }
}
```
#### 4 - Arrays
```typescript
import diffMapper, { DiffMapResult } from 'diff-mapper';

const diff = diffMapper.map([1, 2, 3], [1, 2, 3, 4, 5, 6]);
console.info(diff);
{
  0: { type: 'UNCHANGED', currentValue: 1, newValue: 1 },
  1: { type: 'UNCHANGED', currentValue: 2, newValue: 2 },
  2: { type: 'UNCHANGED', currentValue: 3, newValue: 3 },
  3: { type: 'CREATED', currentValue: undefined, newValue: 4 },
  4: { type: 'CREATED', currentValue: undefined, newValue: 5 },
  5: { type: 'CREATED', currentValue: undefined, newValue: 6 },
}
```
## Utils

```typescript
diffMapper.toArray - returns DiffMapResult represented as an array
diffMapper.toString - returns DiffMapResult stringified
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache 2.0](https://choosealicense.com/licenses/apache-2.0/)