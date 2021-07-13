export const checkForMobNum = async (inputTerm) => {
  console.log('::: Running checkForMobNum :::', inputTerm);

  function validMobNum(inputTerm) {
    let regexp = /^\+?01[0-9]{9}$/;
    return regexp.test(inputTerm);
  }

  if (validMobNum(inputTerm)) {
    return true;
  }
  return false;
};
