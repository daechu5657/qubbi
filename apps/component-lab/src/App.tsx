import { api } from "./api";

async function getPublicZipFile(fileName: string): Promise<File> {
  const response = await fetch(`/${fileName}`);

  if (!response.ok) {
    throw new Error("파일을 불러오는데 실패했습니다.");
  }

  const blob = await response.blob();

  const file = new File([blob], fileName, { type: "application/zip" });

  return file;
}

async function handleUpload() {
  const bundleZip = await getPublicZipFile("bundle.zip");

  const formData = new FormData();
  formData.append("bundle.zip", bundleZip);

  try {
    await api.POST("/componentLab/componentManifest/upload", {
      body: formData as any,
    });
  } catch (error) {
    console.error(error);
  }
}

function App() {
  return (
    <>
      <button onClick={handleUpload}>submit</button>
    </>
  );
}

export default App;
