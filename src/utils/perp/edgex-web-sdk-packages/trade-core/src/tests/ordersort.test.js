
const { sortOrder } = require("@/components/calculator/order");

test("order sort test sort by contractId and side and price", () => {
  const order = [
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "02", contractId: "10000001", side: "SELL", price: "100", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "03", contractId: "10000001", side: "BUY", price: "100", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "04", contractId: "10000001", side: "SELL", price: "0", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "05", contractId: "10000001", side: "BUY", price: "0", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "06", contractId: "10000001", side: "SELL", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "07", contractId: "1000000", side: "BUY", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
  ];

  const sortedOrder = sortOrder(order);
  const expectedSortedOrder = [
    { id: "07", contractId: "1000000", side: "BUY", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "05", contractId: "10000001", side: "BUY", price: "0", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "03", contractId: "10000001", side: "BUY", price: "100", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "04", contractId: "10000001", side: "SELL", price: "0", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "06", contractId: "10000001", side: "SELL", price: "90", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
    { id: "02", contractId: "10000001", side: "SELL", price: "100", type: "LIMIT", createdTime: "1708042549718", triggerTime: "1708042549718" },
  ];
  expect(sortedOrder).toEqual(expectedSortedOrder);
});

test("order sort test sort by type and triggerTime/createdTime and id", () => {
  const order = [
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1700000000000", triggerTime: "1700000000000" },
    { id: "02", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "03", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
    { id: "04", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
  ];

  const sortedOrder = sortOrder(order);
  const expectedSortedOrder = [
    { id: "03", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
    { id: "04", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
    { id: "02", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1700000000000", triggerTime: "1700000000000" },
  ];
  expect(sortedOrder).toEqual(expectedSortedOrder);
});

test("order sort test sort by price type and triggerTime/createdTime and id", () => {
  const order = [
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1700000000000", triggerTime: "1700000000000" },
    { id: "02", contractId: "10000001", side: "BUY", price: "100", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "03", contractId: "10000001", side: "BUY", price: "0", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "04", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
    { id: "05", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1920000000000" },
  ];

  const sortedOrder = sortOrder(order);
  const expectedSortedOrder = [
    { id: "03", contractId: "10000001", side: "BUY", price: "0", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "02", contractId: "10000001", side: "BUY", price: "100", type: "LIMIT", createdTime: "1800000000000", triggerTime: "1700000000000" },
    { id: "05", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1920000000000" },
    { id: "04", contractId: "10000001", side: "BUY", price: "90", type: "STOP_LIMIT", createdTime: "1800000000000", triggerTime: "1900000000000" },
    { id: "01", contractId: "10000001", side: "BUY", price: "90", type: "LIMIT", createdTime: "1700000000000", triggerTime: "1700000000000" },
  ];
  expect(sortedOrder).toEqual(expectedSortedOrder);
});
