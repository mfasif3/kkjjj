import QRCode from "qrcode"

export async function generateQRCode(data: string): Promise<string> {
  try {
    // Generate QR code as data URL
    const url = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      margin: 1,
      color: {
        dark: "#8b5cf6",
        light: "#ffffff00", // Transparent background
      },
    })
    return url
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}
