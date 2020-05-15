export interface TimeType {
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
}

const updateTime = (k: number): number | string => {
  if (k < 10) {
    return '0' + k;
  } else {
    return k;
  }
};

export const getSeconds = (time: string): number => {
  const seconds = time
    .split(':')
    .reverse()
    .reduce((prev, curr, i) => prev + parseInt(curr) * Math.pow(60, i), 0);
  return +seconds.toFixed(18);
};

export const getFraction = (seconds: number): number => {
  const hours = seconds / Math.pow(60, 2);
  return +hours.toFixed(18);
};

export const getTimeObjectFromSeconds = (
  totalSeconds: number,
  formated?: boolean,
): string | TimeType => {
  const hours = updateTime(Math.floor((totalSeconds % Math.pow(60, 3)) / Math.pow(60, 2)));
  const minutes = updateTime(Math.floor((totalSeconds % Math.pow(60, 2)) / 60));
  const seconds = updateTime(Math.floor(totalSeconds % 60));

  const object = {
    hours,
    minutes,
    seconds,
  };

  const string = `${hours}:${minutes}:${seconds}`;

  return formated ? string : object;
};

export const getTimeObjectFromFraction = (
  fraction: number,
  formated?: boolean,
): string | TimeType => {
  const totalSeconds = fraction * Math.pow(60, 2);

  return getTimeObjectFromSeconds(totalSeconds, formated);
};
