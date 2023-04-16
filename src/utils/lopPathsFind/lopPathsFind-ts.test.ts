import { describe, expect, test } from '@jest/globals';
import { lopPathsFind, ISARR } from './lopPathsFind-ts';

const data = {
  f1: {
    a1: [
      { c1: 1 },
      { c1: 2 },
      {
        b2: [{ n1: 'some' }],
      },
      {
        k7: 'red',
        b2: [
          { n1: 'prom' },
        ],
      },
    ],
    x1: 'str',
    l1: {
      k1: [
        { b2: 'span' },
        { c3: 'alert' },
      ],
    },
  },
};

const data2 = [[{ a: 1 }], [['hello'], 3], 'ram'];

describe('lopPathsFind-ts', () => {

  it('A-001', () => {
    const result = lopPathsFind(data, `f1.a1.${ISARR}.b2.${ISARR}.n1`);
    expect(result).toHaveLength(2);
    expect(result?.[0]?.path).toEqual('f1.a1.2.b2.0.n1');
    expect(result?.[0]?.value).toEqual('some');
    expect(result?.[1]?.path).toEqual('f1.a1.3.b2.0.n1');
    expect(result?.[1]?.value).toEqual('prom');
  });

  it('A-002 not exist path', () => {
    const result = lopPathsFind(data, `f1.a1.${ISARR}.b2.${ISARR}.n1-notexist`);
    expect(result).toHaveLength(2);
    expect(result?.[0]?.path).toEqual('f1.a1.2.b2.0.n1-notexist');
    expect(result?.[0]?.value).toEqual(undefined);
    expect(result?.[1]?.path).toEqual('f1.a1.3.b2.0.n1-notexist');
    expect(result?.[1]?.value).toEqual(undefined);
  });

  it('A-003', () => {
    const result = lopPathsFind(data2, `${ISARR}.${ISARR}.a`);
    expect(result).toHaveLength(3);
    expect(result?.[0]?.path).toEqual('0.0.a');
    expect(result?.[0]?.value).toEqual(1);
    expect(result?.[1]?.path).toEqual('1.0.a');
    expect(result?.[1]?.value).toEqual(undefined);
    expect(result?.[2]?.path).toEqual('1.1.a');
    expect(result?.[2]?.value).toEqual(undefined);
  });

  it('A-004a', () => {
    const result = lopPathsFind(data2, `${ISARR}`);
    expect(result).toHaveLength(3);
    expect(result?.[0]?.path).toEqual('0');
    expect(result?.[0]?.value).toBeTruthy();
    expect(result?.[1]?.path).toEqual('1');
    expect(result?.[1]?.value).toBeTruthy();
    expect(result?.[2]?.path).toEqual('2');
    expect(result?.[2]?.value).toEqual('ram');
  });

  it('A-004b', () => {
    const result = lopPathsFind(data2, `${ISARR}`, (val) => (val === 'ram'));
    expect(result).toHaveLength(1);
    expect(result?.[0]?.path).toEqual('2');
    expect(result?.[0]?.value).toEqual('ram');
  });

  it('A-004c', () => {
    const result = lopPathsFind(data2, `${ISARR}.${ISARR}`, (val) => (val === 3));
    expect(result).toHaveLength(1);
    expect(result?.[0]?.path).toEqual('1.1');
    expect(result?.[0]?.value).toEqual(3);
  });

  it('A-004d', () => {
    const result = lopPathsFind(data2, `${ISARR}.${ISARR}.${ISARR}`, (val) => (val === 'hello'));
    expect(result).toHaveLength(1);
    expect(result?.[0]?.path).toEqual('1.0.0');
    expect(result?.[0]?.value).toEqual('hello');
  });

  it('B-001', () => {
    const result = lopPathsFind(data, `f1.a1.${ISARR}.b2.${ISARR}.n1`, (val) => {
      return val === 'some';
    });
    expect(result).toHaveLength(1);
    expect(result?.[0]?.path).toEqual('f1.a1.2.b2.0.n1');
    expect(result?.[0]?.value).toEqual('some');
  });

  it('B-003', () => {
    const result = lopPathsFind(data2, `${ISARR}.${ISARR}.a`, (val) => (val === 1));
    expect(result).toHaveLength(1);
    expect(result?.[0]?.path).toEqual('0.0.a');
    expect(result?.[0]?.value).toEqual(1);
  });

  it('B-003b', () => {
    const result = lopPathsFind(data2, `${ISARR}.${ISARR}.a`, (val) => (val === 100));
    expect(result).toHaveLength(0);
  });

});

export {};