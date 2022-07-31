import React from "react";
import { useCallback, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");
  const [loading, setLoading] = useState(false);
  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    await worker.load();
    await worker.loadLanguage("eng+chi_sim+rus+jpn+kor");
    await worker.initialize("eng+chi_sim+rus+jpn+kor");
    const { data } = await worker.recognize(selectedImage);
    setTextResult(data.text);
    setLoading(false);
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText]);

  const handleChangeImage = (e) => {
    setLoading(true);
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult("");
    }
  };

  const [copySuccess, setCopySuccess] = useState("");

  // your function to copy here

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopySuccess("Copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  return (
    <>
    <div className="bg-amber-50">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-6xl font-sans font-bold text-indigo-500 p-8 ">
          imxt_
        </h1>
        <p className="text-md text-sky-600 mx-8">
          Choose any image file and convert it to text. (en/rus/jpn/cn/kor)
        </p>
        <div className="flex justify-between py-4 mx-8 items-center">
          <div className="block">
            <label
              className="bg-sky-200 rounded-md cursor-pointer py-2 px-4 text-sm"
              htmlFor="imxt"
            >
              UploadFile
            </label>
            <input
              type="file"
              id="imxt"
              placeholder="Imxt"
              accept="image/*"
              onChange={handleChangeImage}
              className="hidden"
            />
          </div>

          <div className="flex text-sm">
            <p className="text-green-600 rounded-md cursor-pointer py-2 px-4 text-center font-bold">
              {copySuccess}
            </p>
            <button
              onClick={() => copyToClipBoard(textResult)}
              className="bg-sky-200 rounded-md cursor-pointer py-2 px-4"
            >
              CopyMe
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-1 bg-stone-200 shadow-md h-[600px] md:basis-[40%] basis-full rounded-2xl">
            {selectedImage && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="thumb"
                className="object-contain w-full p-4"
              />
            )}
          </div>

          <div className="flex flex-1 bg-stone-200 h-[600px] shadow-md md:basis-[40%] basis-full rounded-2xl overflow-auto">
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <span className="text-2xl animate-pulse mr-2">
                  {" "}
                  Loading...{" "}
                </span>
                <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-pink-600 animate-spin rounded-full border-4 border-black"></div>
              </div>
            ) : (
              textResult && (
                <p className="text-left text-2xl inline-block p-4">
                  {textResult}
                </p>
              )
            )}
          </div>
        </div>
      </div>
</div>
    </>
  );
}

export default App;
