export const getSeconds = (time: string): number => {
  const seconds = time
    .split(':')
    .reverse()
    .reduce((prev, curr, i) => prev + parseInt(curr) * Math.pow(60, i), 0);
  return seconds;
};

export const getFraction = (seconds: number): number => {
  const hours = seconds / (60 * 60);
  return hours;
};

export const getTimeFormated = (fraction: number): string => {
  const hours = Math.floor(fraction);
  const allseconds = 3600 * (fraction - hours);
  const minutes = Math.floor(allseconds / 60);
  const seconds = Math.floor(allseconds % 60);

  const formatted =
    ('0' + (hours % 12)).substr(-2) +
    ':' +
    ('0' + minutes).substr(-2) +
    ':' +
    ('0' + seconds).substr(-2);

  return formatted;
};

export const getTimeFromSeconds = (totalSeconds: number): string => {
  //const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${('0' + hours).slice(-2)}:${('0' + minutes).slice(-2)}:${(
    '0' + seconds
  ).slice(-2)}`;
};