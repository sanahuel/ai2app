function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();

  this.SheetNames = [];

  this.Sheets = {};
}

const download = (url, name) => {
  let a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  window.URL.revokeObjectURL(url);
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);

  const view = new Uint8Array(buf);

  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

  return buf;
}

export default (data) => {
  import("xlsx").then((XLSX) => {
    const wb = new Workbook();
    const ws = XLSX.utils.json_to_sheet(data);

    wb.SheetNames.push("Sheet1");
    wb.Sheets["Sheet1"] = ws;

    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary",
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" })
    );

    download(url, "import.xlsx");
  });
};
