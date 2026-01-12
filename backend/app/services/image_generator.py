"""Image generation service using Google Gemini Nano Banana Pro"""

from google import genai
from google.genai import types
from typing import Optional
import os
from app.config import settings


class ImageGenerator:
    """
    Service for generating 'Love Is...' style images using Nano Banana Pro
    """

    def __init__(self):
        self.api_key = settings.google_api_key

        # Configure the Gemini API client
        self.client = genai.Client(api_key=self.api_key)

        # Use Nano Banana Pro (Gemini 3 Pro Image Preview) as requested
        # Documentation: https://github.com/googleapis/python-genai
        self.model_name = "gemini-3-pro-image-preview"

        # Load reference image for style consistency
        self.reference_image_path = os.path.join(
            os.path.dirname(__file__), "..", "..", "reference.jpeg"
        )
        self.reference_image_bytes = self._load_reference_image()

    async def generate_fatherhood_image(self, user_text: str) -> bytes:
        """
        Generate a 'Fatherhood is...' image based on user text

        Args:
            user_text: User's definition of fatherhood

        Returns:
            PNG image as bytes

        Raises:
            RuntimeError: If image generation fails
        """
        prompt = self._build_prompt(user_text)

        try:
            # IMPORTANT: Nano Banana Pro uses generate_content() NOT generate_images()
            # Documentation: https://github.com/googleapis/python-genai/blob/main/codegen_instructions.md

            # Build multimodal content with reference image and text prompt
            if self.reference_image_bytes:
                # Include reference image for style consistency
                contents = [
                    types.Part.from_bytes(
                        data=self.reference_image_bytes, mime_type="image/jpeg"
                    ),
                    types.Part.from_text(
                        text=f"""Generate an image in EXACTLY the same style as the reference image above.

{prompt}

IMPORTANT: Include text in the image layout:
- At the top left corner: "Fatherhood is..." in a simple serif font (similar to the reference)
- At the top right corner: Two overlapping red hearts
- At the bottom of the image: "{user_text}" in italic handwritten-style font

After adding text and characters, wrap THE ENTIRE IMAGE (text + illustration) with a thin black border frame around the edges.

The text should be integrated naturally into the vintage comic strip layout, matching the reference image style."""
                    ),
                ]
            else:
                # Fallback to text-only prompt if reference not available
                contents = prompt

            response = self.client.models.generate_content(
                model=self.model_name,
                contents=contents,
                config=types.GenerateContentConfig(
                    image_config=types.ImageConfig(
                        aspect_ratio="2:3",  # Vertical rectangle like vintage postcards
                        image_size="1K"  # Resolution: "1K", "2K", "4K"
                    )
                )
            )

            # Debug: Check response structure
            if response is None:
                raise RuntimeError("Model returned None response")

            if not hasattr(response, 'parts') or response.parts is None:
                # Check if response was blocked
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'finish_reason'):
                        raise RuntimeError(f"Generation blocked: {candidate.finish_reason}")
                raise RuntimeError("Response has no parts - may be blocked by safety filters")

            # Extract image from response parts
            image_bytes = None
            for part in response.parts:
                if hasattr(part, 'inline_data') and part.inline_data is not None:
                    # inline_data contains the raw image bytes
                    image_bytes = part.inline_data.data
                    break
                elif hasattr(part, 'text') and part.text:
                    # Model returned text instead of image
                    print(f"Warning: Model returned text: {part.text[:200]}")

            if image_bytes is None:
                raise RuntimeError("No image data in response - the prompt may have been rejected by content filters")

            return image_bytes

        except Exception as e:
            # More detailed error logging
            print(f"Image generation error: {type(e).__name__}: {str(e)}")
            raise RuntimeError(f"Failed to generate image: {str(e)}") from e

    def _build_prompt(self, user_text: str) -> str:
        """
        Build the prompt for image generation in 'Love Is...' style
        Based on the master prompt for Kim Casali's iconic 1970s comic strip style

        Args:
            user_text: User's fatherhood definition

        Returns:
            Formatted prompt string
        """
        return f"""A vertical vintage single-panel comic strip in the iconic style of Kim Casali's 'Love is...' series from the 1970s, but themed as 'Fatherhood is...'.

The artwork features two stylized, chibi-like characters: a father figure (taller) and a child (smaller, about 60% the height). Both characters have large heads, small simple bodies, and dot eyes with no mouths or very simple facial expressions.

The scene depicts: {user_text}

The father and child should be shown in a touching, heartwarming moment that illustrates the concept of "{user_text}".

STYLE REQUIREMENTS:
- Hand-drawn ink line art with flat, slightly imperfect marker-style coloring
- Lines are sketchy and organic, not vector-perfect
- Simple chibi proportions: big heads, small bodies
- Only dot eyes (two small black dots per character)
- No detailed mouths, noses, or complex facial features
- Minimal clothing details - simple shapes and colors
- Muted primary colors: faded red, blue, yellow, with black ink outlines
- Background: PURE WHITE (clean white background, no texture or aging)
- The overall aesthetic is nostalgic, whimsical, and warm
- Resembling a vintage comic strip card

COMPOSITION AND FRAMING:
- Vertical rectangle format (portrait orientation, 2:3 aspect ratio)
- IMPORTANT: The ENTIRE image (text + illustration + white background) should be wrapped with a thin black border around all edges (like a vintage postcard frame)
- Characters centered with space around them
- Clean, crisp look on pure white background
- Leave space at top and bottom for text
- The black frame is the outermost element wrapping everything

NEGATIVE ELEMENTS TO AVOID:
- NO photorealistic details
- NO 3D render, shiny, or glossy effects
- NO high definition detailed anatomy
- NO distinct fingers or detailed hands
- NO vector art or digital painting style
- NO gradients or neon colors
- NO aged, yellowed, or textured paper background (use pure white only)
- NO anime style or manga style
- NO text or captions in the image itself (text will be added separately)

The style should authentically replicate the warm, innocent, hand-drawn quality of the original 1970s Kim Casali 'Love is...' comic strips, but adapted for the theme of fatherhood."""

    def _load_reference_image(self) -> bytes:
        """
        Load reference image for style consistency

        Returns:
            bytes: Reference image as bytes

        Raises:
            RuntimeError: If reference image cannot be loaded
        """
        try:
            with open(self.reference_image_path, "rb") as f:
                return f.read()
        except FileNotFoundError:
            print(
                f"Warning: Reference image not found at {self.reference_image_path}. Proceeding without reference."
            )
            return b""
        except Exception as e:
            print(f"Warning: Failed to load reference image: {e}. Proceeding without reference.")
            return b""


# Singleton instance
_image_generator: Optional[ImageGenerator] = None


def get_image_generator() -> ImageGenerator:
    """Get or create the ImageGenerator singleton instance"""
    global _image_generator
    if _image_generator is None:
        _image_generator = ImageGenerator()
    return _image_generator
