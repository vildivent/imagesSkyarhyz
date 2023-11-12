const arrayToString = (array: string[]) => {
  return array.toString().replace(/(,)/g, ", ");
};

export default arrayToString;
