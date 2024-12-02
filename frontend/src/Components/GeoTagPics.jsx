import { useState, useRef, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import Planet from "../Backgrounds/Planet";
import Navbar from "./navbar";

export default function GeoTagPics() {
  const {id} = useParams();
  const projectId = id;
  const [pics, setPics] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch images from backend
  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost/backend/get_images.php?project_id=${projectId}`
      );
      const data = await response.json();

      const parsedData = data.map((pic) => ({
        ...pic,
        latitude: parseFloat(pic.latitude),
        longitude: parseFloat(pic.longitude),
      }));

      setPics(parsedData);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  }, [projectId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);


  const deletePicture = useCallback(async (id) => {
    try {
      const response = await fetch(
        `http://localhost/backend/delete_image.php?image_id=${id}&project_id=${projectId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  }, [projectId, fetchImages]);

  const downloadImage = async (pic) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = pic.image_url;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height + 100;

      context.drawImage(img, 0, 0);

      context.fillStyle = "rgba(0, 0, 0, 0.75)";
      context.fillRect(0, img.height, canvas.width, 100);

      context.fillStyle = "white";
      context.font = "16px Arial";
      context.textBaseline = "top";
      context.fillText(`Latitude: ${pic.latitude.toFixed(6)}`, 10, img.height + 10);
      context.fillText(`Longitude: ${pic.longitude.toFixed(6)}`, 10, img.height + 30);
      context.fillText(
        `Timestamp: ${new Date(pic.timestamp).toLocaleString()}`,
        10,
        img.height + 50
      );

      const dataUrl = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `geo-tagged-image-${pic.image_id}.jpg`;
      link.click();
    };
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 text-gray-200">
      <Navbar />
      <header>
        <h1 className="text-7xl font-bold text-center mb-10 text-white">Geo<span className="text-purple-600">Tag</span>Pics</h1>
      </header>
      <Planet />
      <div>
        <div className="flex justify-center mb-4">
         
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {pics.map((pic) => (
              <div
                key={pic.image_id}
                className="relative bg-black rounded-lg shadow-md overflow-hidden flex flex-col  border border-white"
              >
                <img
                  src={pic.image_url}
                  alt={`Geo-tagged pic ${pic.image_id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 bg-black text-gray-200 text-sm">
                  <p>
                    <strong>Latitude:</strong> {pic.latitude.toFixed(6)}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {pic.longitude.toFixed(6)}
                  </p>
                  <p>
                    <strong>Timestamp:</strong>{" "}
                    {new Date(pic.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-stretch">
                  <button
                    className="w-full px-3 py-2 bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                    onClick={() => deletePicture(pic.image_id)}
                  >
                    Delete Picture
                  </button>
                  <button
                    className="w-full px-3 py-2 bg-yellow-600 text-white text-sm font-semibold hover:bg-yellow-700"
                    onClick={() => downloadImage(pic)}
                  >
                    Download Picture
                  </button>
                </div>
              </div>
            ))}
          </div>
      </div>
      <footer className="flex justify-center mt-6">
        <p className="text-sm text-gray-400">
          {pics.length} {pics.length === 1 ? "picture" : "pictures"} taken
        </p>
      </footer>
      <canvas ref={canvasRef} width="640" height="480" className="hidden" />
    </div>
  );
}
