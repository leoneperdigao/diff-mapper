/* eslint-disable no-console */
import diffMapper from '../src/diffMapper';

const testInput = {
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

describe('DiffMapper', () => {
  test('Should return an empty map, no diff', () => {
    const diff = diffMapper.map({}, {});
    expect(diff).toEqual({});
  });

  test('Should return a diff map, unchanged property', () => {
    const object1 = { a: 1 };
    const object2 = { a: 1 };
    const diff = diffMapper.map(object1, object2);
    expect(diff).toEqual({ a: { type: 'UNCHANGED', currentValue: 1, newValue: 1 } });
  });

  test('Should return a diff map, added property and removed other', () => {
    const object1 = { a: 1 };
    const object2 = { b: 1 };
    const diff = diffMapper.map(object1, object2);
    expect(diff).toEqual(
      {
        a: { type: 'DELETED', currentValue: 1, newValue: undefined },
        b: { type: 'CREATED', currentValue: undefined, newValue: 1 },
      },
    );
  });

  test('Should return an empty map, no diff, array', () => {
    const diff = diffMapper.map([], []);
    expect(diff).toEqual({});
  });

  test('Should throw an error, function given', () => {
    expect.assertions(1);
    try {
      diffMapper.map(() => { }, () => { });
    } catch (err) {
      expect(err.message).toEqual('Invalid argument. Function given, object expected.');
    }
  });

  test('Should return a map with unchanged values, when both objects are undefined', () => {
    const diff = diffMapper.map(undefined, undefined);
    expect(diff).toEqual({
      type: 'UNCHANGED',
      currentValue: undefined,
      newValue: undefined,
    });
  });

  test('Should a diff map, array', () => {
    const diff = diffMapper.map([1, 2, 3], [1, 2, 3, 4, 5, 6]);
    expect(diff).toEqual({
      0: { type: 'UNCHANGED', currentValue: 1, newValue: 1 },
      1: { type: 'UNCHANGED', currentValue: 2, newValue: 2 },
      2: { type: 'UNCHANGED', currentValue: 3, newValue: 3 },
      3: { type: 'CREATED', currentValue: undefined, newValue: 4 },
      4: { type: 'CREATED', currentValue: undefined, newValue: 5 },
      5: { type: 'CREATED', currentValue: undefined, newValue: 6 },
    });
  });

  test('Should map differences, complex object, change even types', () => {
    const diff = diffMapper.map(testInput, {
      a: 'i am unchanged',
      c: 'i am created',
      e: { a: '1', b: '', d: 'created' },
      f: [{
        a: 'same',
        b: [{ a: 'same' }, { c: 'create' }],
      }, 1],
      g: new Date('2020.05.04'),
    });
    expect(diff).toEqual({
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
    });
  });
});
