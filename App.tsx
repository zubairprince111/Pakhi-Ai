import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { Spinner } from './components/Spinner';
import { generateCouplePicture } from './services/geminiService';

const App: React.FC = () => {
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [mode, setMode] = useState<'realistic' | 'artistic'>('realistic');
  const environments = ['Cozy Cafe', 'Autumn Park Walk', 'Beach Sunset', 'Mountain Hike', 'City Nightscape', 'Tropical Paradise'];
  const styles = ['Oil Painting', 'Watercolor', 'Cartoon', 'Anime', 'Pop Art', 'Cyberpunk'];
  const dressStyles = ['Casual Wear', 'Formal Attire', 'Bengali Traditional', 'South Indian Traditional', 'Rajasthani Traditional', 'Western Wedding', 'Vintage Classic'];
  
  const [environment, setEnvironment] = useState<string>(environments[0]);
  const [style, setStyle] = useState<string>(styles[0]);
  const [dressStyle, setDressStyle] = useState<string>(dressStyles[0]);


  const handleGenerate = useCallback(async () => {
    if (!image1 || !image2) {
      setError('Please upload both images.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const options = {
        mode,
        selection: mode === 'realistic' ? environment : style,
        dressStyle,
      };
      const { imageData } = await generateCouplePicture(image1, image2, options);
      setGeneratedImage(imageData);
    } catch (e) {
      console.error(e);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [image1, image2, mode, environment, style, dressStyle]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="container mx-auto max-w-5xl w-full flex-grow flex flex-col">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Couple Fusion AI
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            Upload two photos, choose a style or scene, and let AI magically create a unique couple picture for you!
          </p>
        </header>

        <div className="w-full flex-grow flex flex-col lg:flex-row items-center justify-center gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <ImageUploader id="image1" label="First Person" imageUrl={image1} onImageUpload={setImage1} />
            <ImageUploader id="image2" label="Second Person" imageUrl={image2} onImageUpload={setImage2} />
          </div>
        </div>
        
        <div className="my-8 w-full max-w-xl mx-auto bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-center text-gray-200 mb-4">Customize Your Creation</h3>
            <div className="flex justify-center gap-4 mb-5">
              {(['realistic', 'artistic'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`capitalize w-full px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    mode === m 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {m === 'realistic' ? 'Realistic Scene' : 'Artistic Style'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="style-select" className="block text-sm font-medium text-gray-400 mb-2">
                  {mode === 'realistic' ? 'Choose a Scene:' : 'Choose a Style:'}
                </label>
                <select 
                  id="style-select"
                  value={mode === 'realistic' ? environment : style}
                  onChange={(e) => mode === 'realistic' ? setEnvironment(e.target.value) : setStyle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500"
                >
                  {(mode === 'realistic' ? environments : styles).map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
               <div>
                <label htmlFor="dress-style-select" className="block text-sm font-medium text-gray-400 mb-2">
                  Choose a Dress Style:
                </label>
                <select 
                  id="dress-style-select"
                  value={dressStyle}
                  onChange={(e) => setDressStyle(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-purple-500 focus:border-purple-500"
                >
                  {dressStyles.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
        </div>

        <div className="my-8 text-center">
          <button
            onClick={handleGenerate}
            disabled={!image1 || !image2 || isLoading}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Creating Magic...' : 'Generate Picture'}
          </button>
        </div>
        
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}

        <div className="w-full flex-grow flex flex-col items-center justify-center mt-4">
          {isLoading && <Spinner />}

          {generatedImage && (
            <div className="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-2xl w-full max-w-md lg:max-w-lg transition-all duration-500 animate-fade-in">
              <h2 className="text-2xl font-bold text-center mb-4">Your Fusion!</h2>
              <img
                src={generatedImage}
                alt="Generated couple"
                className="rounded-lg w-full h-auto object-cover"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generating...' : 'Generate Again!'}
              </button>
            </div>
          )}
        </div>
      </main>
       <footer className="text-center py-4 text-gray-500 text-sm">
          <p>Powered by Gemini. Made by Prince</p>
        </footer>
    </div>
  );
};

export default App;