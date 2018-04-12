function getDateList() {
  const dataList = [];
  for (let i = 0; i < 100; i++) {
    const number = Number(Math.random());
    if (number >= 0.1) {
      dataList.push({ height: parseInt(number * 500) });
    }
  }
  return dataList;
}

const dataList = getDateList();

export default dataList;
