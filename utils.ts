import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const hp = (value: number | string): number => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return (height * numericValue) / 100;
};

export const wp = (value: number | string): number => {
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  return (width * numericValue) / 100;
};