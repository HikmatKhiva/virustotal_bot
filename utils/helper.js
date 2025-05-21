export const extractDataMD5 = async ({ data }) => {
  const id = data.id || "";
  const names = data?.attributes?.names || [];
  const firstSubmittedAt =
    new Date(data?.attributes?.first_submission_date * 1000) || new Date();
  const threatCategory =
    data.attributes?.popular_threat_classification?.popular_threat_category ||
    [];
  const threatName =
    data.attributes?.popular_threat_classification?.popular_threat_name || [];
  const threatLabel =
    data.attributes?.popular_threat_classification?.suggested_threat_label ||
    "";
  const analyses =
    data?.attributes?.last_analysis_stats || data?.attributes?.stats || {};
  const type = data?.attributes?.type_tag || data?.type || "undefined";
  return {
    id,
    names,
    firstSubmittedAt,
    threatCategory,
    threatName,
    threatLabel,
    analyses,
    type,
  };
};

export const messageTypes = {
  checkFile: (data) => {
    if (data.type === "android") {
      return messageTypes.APKFileScan(data);
    }
    return messageTypes.FileScan(data);
  },
  APKFileScan: (data) => {
    return `Scan result: \n
    ID: ${data.id}\n
    Nomlari: ${data?.names?.join(",")}\n
    Birinchi teshir vaqti: ${data?.firstSubmittedAt}\n
    Xujum turlari: ${data?.threatCategory
      .map((item) => item?.value)
      .join(", ")}\n
    Xujum ismlari: ${data?.threatName?.map((item) => item?.value)?.join(", ")}\n
    Antiviruslar tekshiruv natijasi: ${messageTypes.secondMessage(
      data?.analyses
    )}\n`;
  },
  FileScan: (data) => {
    return `
      ID: ${data.id}\n
      Antiviruslar tekshiruv natijasi: ${messageTypes.secondMessage(
        data?.analyses
      )}\n
    `;
  },
  secondMessage: (data) => {
    return `
    Xavfli: <b>${data?.malicious}</b> 
    Shubxali: <b>${data?.suspicious}</b>
    Aniqlanmadi: <b>${data?.undetected}</b> found.
    `;
  },
};

export const reCheckMD5 = ()=>{
  
}