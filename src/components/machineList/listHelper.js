import {isIphoneX, isPhone, isTablet} from 'react-native-device-detection';

export const statusIdObj = {
  1: 'Active',
  2: 'Change',
  3: 'Setup',
  4: 'Not Productive',
};

export const upId = (idOld, sortedData) => {
  let id = idOld;
  sortedData.forEach((items, y) => {
    items.forEach((item, index) => {
      if (!item) {
        return;
      }
      if (item.id === idOld) {
        if (sortedData[y - 1] && sortedData[y - 1][index]) {
          id = sortedData[y - 1][index].id;
        } else {
          if (
            sortedData[sortedData.length - 1] &&
            sortedData[sortedData.length - 1][index]
          ) {
            id = sortedData[sortedData.length - 1][index].id;
          }
        }
      }
    });
  });
  return id;
};

export const downId = (idOld, sortedData) => {
  let id = idOld;
  sortedData.forEach((items, y) => {
    items.forEach((item, index) => {
      if (!item) {
        return;
      }
      if (item.id === idOld) {
        if (sortedData[y + 1] && sortedData[y + 1][index]) {
          id = sortedData[y + 1][index].id;
        } else {
          if (sortedData[0] && sortedData[0][index]) {
            id = sortedData[0][index].id;
          }
        }
      }
    });
  });
  return id;
};

export const nextId = (idOld, sortedData) => {
  let id = idOld;
  sortedData.forEach((items, y) => {
    items.forEach((item, index) => {
      if (!item) {
        return;
      }
      if (item.id === idOld) {
        if (items[index + 1] && items[index + 1].id) {
          id = items[index + 1].id;
        } else {
          if (sortedData[y + 1] && sortedData[y + 1][0].id) {
            id = sortedData[y + 1][0].id;
          } else {
            id = sortedData[0][0].id;
          }
        }
      }
    });
  });
  return id;
};

export const prevId = (idOld, sortedData) => {
  let id = idOld;
  sortedData.forEach((items, y) => {
    items.forEach((item, index) => {
      if (!item) {
        return;
      }
      if (item.id === idOld) {
        if (items[index - 1] && items[index - 1].id) {
          id = items[index - 1].id;
        } else {
          if (
            sortedData[y - 1] &&
            sortedData[y - 1][sortedData[y - 1].length - 1] &&
            sortedData[y - 1][sortedData[y - 1].length - 1].id
          ) {
            id = sortedData[y - 1][sortedData[y - 1].length - 1].id;
          } else {
            id =
              sortedData[sortedData.length - 1][
                sortedData[sortedData.length - 1].length - 1
              ].id;
          }
        }
      }
    });
  });
  return id;
};

const sizeFormater = (value) => {
  const part = value - Math.floor(value);

  if (part < 0.25) {
    return Math.floor(value);
  }
  if (part >= 0.25 && part < 0.75) {
    return Math.floor(value) + 0.5;
  }
  if (part >= 0.75) {
    return Math.floor(value) + 1;
  }
};

export const countOffset = (format) => {
  const {scale, tileHeightRoundedDown, isTV, isIOS} = format;
  const header = sizeFormater(scale(27));
  // selectSize - increase  - content move up - image and spacing become smaller
  // selectSize - decrease  - vice versa - 181.5
  const selectSize = () => {
    if (isTV || window.isTV) {
      return 165;
    }
    if (isPhone) {
      return 163;
    }
    if (isIOS) {
      if (isPhone) {
        return 154.6;
      } else {
        return 160;
      }
    }
    return 160;
  };
  const summary = header + scale(selectSize());

  let oversize = false;
  let fixOversize = {
    offsetImg: 0,
    offsetCircle: 0,
    offsetImgSize: 0,
    issueTopOffset: 0,
  };

  if (summary > tileHeightRoundedDown) {
    oversize = true;
    let overCount = summary - tileHeightRoundedDown;

    fixOversize.issueTopOffset = (overCount + scale(2)) / 2;
    if (overCount > scale(15)) {
      fixOversize.offsetImg = scale(7);
      fixOversize.offsetCircle = scale(8);
      overCount -= scale(15);
      fixOversize.offsetImgSize = overCount + scale(1);
    } else {
      fixOversize.offsetImg = overCount / 1.6;
      fixOversize.offsetCircle = overCount / 2;
    }
  }

  return {fixOversize, oversize};
};
