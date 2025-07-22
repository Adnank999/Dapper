import React, { useState } from 'react';

const ImageUpload = ({ setImageUrl }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setImageUrl(reader.result); // Pass the image URL back to the parent
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-white/90 text-sm font-medium" htmlFor="imageUpload">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="block w-full text-white/80 bg-white/20 border border-white/30 rounded mt-1"
      />
      {selectedImage && (
        <img src={"http://image.com"} alt="Selected" className="mt-2 w-full h-auto rounded" />
      )}
    </div>
  );
};

export default ImageUpload;
