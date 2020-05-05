import {
  getFraction,
  getSeconds,
  getTimeFormated,
  getTimeFromSeconds,
} from './time';

describe('Time Utils', () => {
  it('return seconds given a time', () => {
    const time = getSeconds('01:30:00');

    expect(time).toEqual(5400);
  });

  it('return a fraction of hour given seconds', () => {
    const fraction = getFraction(5400);

    expect(fraction).toEqual(1.5);
  });

  it('return time formated given a fraction', () => {
    const time = getTimeFormated(1.5);

    expect(time).toEqual('01:30:00');
  });

  it('return time formated given a fraction', () => {
    const time = getTimeFromSeconds(5400);
    expect(time).toEqual('01:30:00');
  });

  it('return time formated given a time', () => {
    const time = getTimeFromSeconds(5400);
    const seconds = getSeconds(time);
    const fraction = getFraction(seconds);
    const timeFormated = getTimeFormated(fraction);

    expect(timeFormated).toEqual(time);
  });
});
