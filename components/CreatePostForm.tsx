'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateImage, savePost } from '@/lib/api';
import Image from 'next/image';
import type { ImageGenerationResponse } from '@/types';

export function CreatePostForm() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<ImageGenerationResponse | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const result = await generateImage({
        text: text.trim(),
        author_name: authorName.trim() || undefined,
      });

      setGeneratedData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedData) return;

    setError(null);
    setIsSaving(true);

    try {
      await savePost({
        text: generatedData.text,
        author_name: generatedData.author_name || undefined,
        image_url: generatedData.image_url,
      });

      // Force refresh and redirect
      router.push('/?refresh=' + Date.now());
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post');
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setGeneratedData(null);

    try {
      const result = await generateImage({
        text: text.trim(),
        author_name: authorName.trim() || undefined,
      });

      setGeneratedData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const charCount = text.length;
  const isValid = charCount >= 3 && charCount <= 280;
  const isFormDisabled = isGenerating || isSaving || !!generatedData;

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Text input */}
        <div>
          <label
            htmlFor="text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fatherhood is...
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="teaching my daughter to ride a bike"
            disabled={isFormDisabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:bg-gray-100"
            rows={4}
            maxLength={280}
            required
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span
              className={`${
                !isValid
                  ? 'text-red-500'
                  : charCount > 250
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              }`}
            >
              {charCount}/280 characters
            </span>
            {charCount > 0 && charCount < 3 && (
              <span className="text-red-500 text-xs">
                Minimum 3 characters
              </span>
            )}
          </div>
        </div>

        {/* Author name (optional) */}
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your name (optional)
          </label>
          <input
            id="authorName"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="John"
            disabled={isFormDisabled}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 disabled:opacity-50 disabled:bg-gray-100"
            maxLength={100}
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Generate button (only show if no preview) */}
        {!generatedData && (
          <>
            <button
              type="submit"
              disabled={!isValid || isGenerating}
              className="w-full rounded-full bg-black px-6 py-4 text-base font-semibold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating your illustration...
                </span>
              ) : (
                'Generate Illustration'
              )}
            </button>

            {/* Info */}
            <p className="text-center text-xs text-gray-500">
              Your illustration will be generated in the style of &quot;Love Is...&quot; comics
            </p>
          </>
        )}
      </form>

      {/* Preview with action buttons */}
      {generatedData && (
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
            Your illustration is ready! 🎉
          </h3>
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gray-50">
            <Image
              src={generatedData.image_url}
              alt="Generated illustration"
              fill
              className="object-contain"
            />
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating || isSaving}
              className="flex-1 rounded-full border-2 border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
            <button
              onClick={handleSave}
              disabled={isGenerating || isSaving}
              className="flex-1 rounded-full bg-black px-6 py-3 text-base font-semibold text-white transition-all hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save & Share'}
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Not happy with the result? Try regenerating or edit your text above.
          </p>
        </div>
      )}

      {/* Loading illustration */}
      {isGenerating && !generatedData && (
        <div className="mt-8 rounded-2xl bg-white p-12 shadow-lg">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
            <p className="text-sm font-medium text-gray-900">
              Creating your illustration...
            </p>
            <p className="text-xs text-gray-500">
              This may take 5-10 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
