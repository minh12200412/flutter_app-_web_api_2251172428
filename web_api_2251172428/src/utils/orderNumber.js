function formatYMD(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

async function generateOrderNumber(trx, ymd) {
  // count orders trong ngày theo prefix ORD-YYYYMMDD-
  const prefix = `ORD-${ymd}-`;
  const row = await trx("orders")
    .where("order_number", "like", `${prefix}%`)
    .count("* as c")
    .first();

  const next = Number(row?.c || 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

module.exports = { formatYMD, generateOrderNumber };
