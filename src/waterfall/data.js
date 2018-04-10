function getDateList() {
  const dataList = [];
  for (let i = 0; i < 100; i++) {
    dataList.push({ height: parseInt(Math.random() * 500) });
  }
  return dataList;
}

const dataList = getDateList();
export default dataList;
