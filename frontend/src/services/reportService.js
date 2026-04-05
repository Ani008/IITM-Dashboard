import axios from "axios";

export const downloadReport = async (endpoint, fileName, fileType = "pdf") => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    });

    const blob = new Blob([response.data], {  
      type:
        fileType === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${fileName}.${fileType}`;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (error) {

    if (error.response) {
      if (error.response.status === 404) {
        alert(error.response.data.message || "No records found.");
        return;
      }

      if (error.response.status === 400) {
        alert(error.response.data.message || "Invalid request.");
        return;
      }
    }

    alert("Failed to download report. Please try again.");
  }
};
